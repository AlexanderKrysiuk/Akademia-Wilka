import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: process.env.NODE_ENV,
});

const nextConfig = {
  images: {
    domains: ['akademiawilka.pl', 'wolfpath.atthost24.pl'], // Obie domeny, z których pobierane są obrazy
  },
};

export default withAutoCert(nextConfig);
