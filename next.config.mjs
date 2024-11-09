/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@mdxeditor/editor'],
    reactStrictMode: true,
    webpack: (config) => {
        // this will override the experiments
        config.experiments = { ...config.experiments, topLevelAwait: true }
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true
        return config
    },
    env: {
        server_host:process.env.SERVER_HOST,
        server_port: process.env.SERVER_PORT,
    }
};


export default nextConfig;
