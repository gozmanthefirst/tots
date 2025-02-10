FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

# Set up the application directory
WORKDIR /app

# Separate dependencies installation to enable caching
FROM base AS deps

# Copy only the files needed for installation
COPY pnpm-lock.yaml package.json ./

# Copy the Prisma directory to allow for `pnpm dlx prisma generate`
COPY prisma ./prisma

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm dlx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy only the necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Build application
RUN npm install -g pnpm && pnpm run build

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=3000

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only necessary files for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]