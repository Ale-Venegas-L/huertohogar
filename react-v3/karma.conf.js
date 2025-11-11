module.exports = function (config) {
  const path = require('path');
  const fs = require('fs');

  // Try to load external webpack config if it exists; otherwise use a minimal inline one
  let webpackConfig = undefined;
  const externalConfigPath = path.resolve(__dirname, 'webpack.config.js');
  if (fs.existsSync(externalConfigPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    webpackConfig = require(externalConfigPath);
  } else {
    webpackConfig = {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { esmodules: true } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
        ],
      },
      resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    };
  }

  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/**/*.test.js', watched: false },
      { pattern: 'src/**/*.test.jsx', watched: false },
    ],

    preprocessors: {
      'src/**/*.test.js': ['webpack'],
      'src/**/*.test.jsx': ['webpack'],
    },

    webpack: webpackConfig,

    browsers: ['FirefoxHeadless'],
    reporters: ['progress'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: process.env.CI === 'true',
    concurrency: Infinity,
    plugins: ['karma-jasmine', 'karma-firefox-launcher', 'karma-webpack'],
  });
};