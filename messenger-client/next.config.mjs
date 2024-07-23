/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * A function that configures webpack.
   *
   * @param {Object} config - the webpack configuration object
   * @param {Object} options - options for webpack
   * @return {Object} the updated webpack configuration
   */
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader"
    });

    return config;
  },
  crossOrigin: 'anonymous',
};

export default nextConfig;
