import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TimeValley | Empowering Startups",
    short_name: "TimeValley",
    description:
      "TimeValley combines strategic business consulting, co-founder matchmaking, 120h Tutor LMS diplomas, and pre-seed capital investment.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF0E9",
    theme_color: "#0E6875",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
