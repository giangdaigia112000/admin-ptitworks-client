/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
        config.infrastructureLogging = { debug: /PackFileCache/ };
        return config;
    },
};

module.exports = nextConfig;