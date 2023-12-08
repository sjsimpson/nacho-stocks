const path = require('path')
// const { HotModuleReplacementPlugin } = require('webpack')

module.exports = {
  entry: './src/index.tsx',
  // mode: 'development', // ...set in package.json
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
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
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  // plugins: [new HotModuleReplacementPlugin()],
}
