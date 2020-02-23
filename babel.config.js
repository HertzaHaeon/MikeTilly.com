module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      },
    ],
    '@babel/preset-react'
  ]
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties'
  ]

  return {
    presets,
    plugins
  }
}
