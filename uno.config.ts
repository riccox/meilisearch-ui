import presetIcons from "@unocss/preset-icons";
// uno.config.ts
import { defineConfig, presetUno } from "unocss";
import theme from "./src/style/theme.json";

export default defineConfig({
	presets: [presetUno(), presetIcons({})],
	theme: {
		colors: {
			...theme.colors,
		},
	},
});
