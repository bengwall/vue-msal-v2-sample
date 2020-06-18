module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    output: {
      filename: '[name].[hash].js',
    },
  },
};
