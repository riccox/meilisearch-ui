// uno.config.ts
import { defineConfig, presetUno } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';
import theme from './src/style/theme.json';

export default defineConfig({
  presets: [presetUno(), presetIcons({})],
  theme: {
    colors: {
      ...theme.colors,
    },
  },
});
