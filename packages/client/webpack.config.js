const path = require('path')
const { HotModuleReplacementPlugin } = require('webpack')

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // options: { presets: ['@babel/env'] },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.css$/i,
        include: /node_modules\/m3-react/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(s[ac]ss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  devServer: {
    port: 3004,
    hot: true,
  },
  plugins: [new HotModuleReplacementPlugin()],
}
