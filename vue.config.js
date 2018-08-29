module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.glsl/,
          loader: 'shader-loader',
        },
      ],
    },
  },
};
