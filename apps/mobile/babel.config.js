// temp: ignore bundle error
process.env.TAMAGUI_IGNORE_BUNDLE_ERRORS = 'solito/link,moti'

module.exports = (api) => {
  api.cache(false)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['../..'],
          alias: {
            // define aliases to shorten the import paths
            '@revit/shared': '../../packages/shared',
            '@revit/ui': '../../packages/ui',
          },
          extensions: ['.js', '.jsx', '.tsx', '.ios.js', '.android.js'],
        },
      ],
      'react-native-reanimated/plugin',
      ...(process.env.EAS_BUILD_PLATFORM === 'android'
        ? []
        : [
            [
              '@tamagui/babel-plugin',
              {
                components: ['@revit/ui', 'tamagui'],
                config: '../../packages/ui/src/tamagui.config.ts',
                disable: true,
              },
            ],
          ]),
    ],
  }
}
