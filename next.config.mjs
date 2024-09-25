// next.config.mjs
import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: "development",
});

const nextConfig = {};

export default withAutoCert(nextConfig);



 
//import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
{/* 
const nextConfig = {
  images: {
    domains: ['maestro.atthost24.pl'], // Dodaj tutaj swoją domenę
  },
};

export default withNextVideo(nextConfig);

*/}