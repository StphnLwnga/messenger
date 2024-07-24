/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "utfs.io",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
    ]
  },
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
