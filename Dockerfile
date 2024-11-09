# Define the DATABASE_URL build argument
# ARG DATABASE_URL

FROM node:20 AS base

# Set up the application directory
WORKDIR /app

# Separate dependencies installation to enable caching
FROM base AS deps

# Include the build argument in this stage
# ARG DATABASE_URL

# Copy only the files needed for installation
COPY pnpm-lock.yaml package.json ./

# Copy the Prisma directory to allow for `pnpm dlx prisma generate`
COPY prisma ./prisma

# Install dependencies
RUN corepack enable pnpm && \
    pnpm install --frozen-lockfile

# Set DATABASE_URL as an environment variable temporarily for migration
# ENV DATABASE_URL=$DATABASE_URL
RUN pnpm dlx prisma generate
# RUN pnpm dlx prisma migrate dev
# RUN pnpm dlx prisma db push

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy only the necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Build application
RUN corepack enable pnpm && pnpm run build

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

# Environment variables for production
ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=3005

#  Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

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
EXPOSE 3005

# Start the application
CMD ["node", "server.js"]