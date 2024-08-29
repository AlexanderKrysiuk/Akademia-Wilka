import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['maestro.atthost24.pl'], // Dodaj tutaj swoją domenę
      },
};

export default withNextVideo(nextConfig);