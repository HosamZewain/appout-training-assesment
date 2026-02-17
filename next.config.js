/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    serverExternalPackages: ['@prisma/client', 'prisma'],
    outputFileTracingIncludes: {
        '/api/**': ['./prisma/**/*', './node_modules/.prisma/**/*'],
    },
}

module.exports = nextConfig
