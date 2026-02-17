/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    serverExternalPackages: ['@prisma/client', 'prisma'],
}

module.exports = nextConfig
