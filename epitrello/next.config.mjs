/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "api.dicebear.com",
            },
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Optimisations de performance
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    },
    // Compression
    compress: true,
    // Optimisation des fonts
    optimizeFonts: true,
};

export default nextConfig;
