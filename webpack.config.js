const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const distPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: distPath,
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS-агрегатор',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  devServer: {
    contentBase: distPath,
  },
};
