import type { NextConfig } from "next";
import webpack from 'webpack';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^react-native$|^react-native-fs$|^react-native-fetch-blob$/
      })
    );
    return config;
  },
};

export default nextConfig;
