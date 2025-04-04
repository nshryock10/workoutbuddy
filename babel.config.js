module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@src': '../../src',
              '@assets': './assets',
              '@navigation': './navigation',
              '@assets/constants': './assets/constants',
            },
          },
        ],
      ],
    };
  };