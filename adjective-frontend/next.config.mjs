import path from "path";

/**
 * next.config.mjs
 */
const nextConfig = {
  reactCompiler: true,

  turbopack: {
    root: path.resolve("."),
  },

  // Proxy /api/* → local backend so browser requests never hit CORS issues
  // Proxy /uploads/* → local backend so Next.js <Image> can serve local uploads
  // NOTE: /api/tiles/* is handled internally by Next.js and is NOT forwarded to backend
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || 'http://localhost:5000';
    return {
      beforeFiles: [],
      afterFiles: [],
      // fallback runs only when no page/API route matched — backend proxy goes here
      fallback: [
        {
          source: '/api/:path*',
          destination: `${target}/api/:path*`,
        },
        {
          source: '/uploads/:path*',
          destination: `${target}/uploads/:path*`,
        },
      ],
    };
  },

  images: {
    // Allow local IP for dev (Next.js blocks localhost by default as SSRF protection)
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Local dev — images proxied through Next.js on port 3000
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      // Direct backend — allowed with dangerouslyAllowLocalIP above
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Production backend
      {
        protocol: "https",
        hostname: "api.adjectiverealestate.in",
        pathname: "/uploads/**",
      },
    ],
  },

  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.devtool = 'source-map';
    }
    // pdfkit is a CommonJS Node.js module — do not bundle it for server
    if (isServer) {
      config.externals = [...(config.externals || []), 'pdfkit'];
    }
    return config;
  },
};

export default nextConfig;
