// uno.config.ts
import { defineConfig, presetUno } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import { presetAttributify } from 'unocss';
import presetTagify from '@unocss/preset-tagify';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';

const theme = require('./src/style/theme.json');

export default defineConfig({
  presets: [presetUno(), presetIcons({}), presetAttributify(), presetTagify()],
  theme: {
    colors: {
      ...theme.colors,
    },
  },
  transformers: [transformerAttributifyJsx()],
});
