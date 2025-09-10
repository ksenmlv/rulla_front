const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Алиасы путей
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@utils': path.resolve(__dirname, 'src/utils')
  };

  // Убираем существующие правила для шрифтов (если есть)
  config.module.rules = config.module.rules.map(rule => {
    if (rule.oneOf) {
      rule.oneOf = rule.oneOf.filter(r => 
        !(r.test && r.test.toString().includes('woff') && r.loader && r.loader.includes('file-loader'))
      );
    }
    return rule;
  });

  // Новое правило для шрифтов
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'static/fonts/[name][ext]'
    }
  });

  // Обработка PDF
  config.module.rules.push({
    test: /\.pdf$/,
    type: 'asset/resource',
    generator: {
      filename: 'static/media/[name].[contenthash:8][ext]'
    }
  });

  // Обработка SCSS файлов
  const scssRule = {
    test: /\.(scss|sass)$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: true,
            localIdentName: '[name]__[local]--[hash:base64:5]'
          }
        }
      },
      'sass-loader'
    ]
  };

  // Добавляем SCSS правило в oneOf или напрямую
  const oneOfRule = config.module.rules.find(rule => rule.oneOf);
  if (oneOfRule) {
    oneOfRule.oneOf.unshift(scssRule);
  } else {
    config.module.rules.push(scssRule);
  }

  // Полифиллы для Node.js модулей
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify')
  };

  // Добавление плагинов
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  );

  return config;
};

// Дополнительные настройки для dev сервера
module.exports.devServer = function (configFunction) {
  return function (proxy, allowedHost) {
    const config = configFunction(proxy, allowedHost);
    config.port = 3001;
    return config;
  };
};