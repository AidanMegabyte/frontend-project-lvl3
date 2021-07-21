import { resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';

const distPath = resolve(process.cwd(), 'dist');

export default {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: distPath,
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS-агрегатор',
      template: './index.html',
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
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  devServer: {
    contentBase: distPath,
  },
};
