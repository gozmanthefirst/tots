import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tots",
    short_name: "Tots",
    description: "A note-taking app.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#e5e999",
    icons: [
      {
        src: "/pwa/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
