const theme = require("./src/style/theme.json");
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx,css}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
		},
		extend: {
			colors: { ...theme.colors },
			screens: {
				tablet: "640px",
				laptop: "1024px",
				desktop: "1280px",
			},
		},
	},
	plugins: [
		nextui({
			layout: {
				radius: {
					s: "4px", // rounded-s
					m: "6px", // rounded-m
					l: "8px", // rounded-l
				},
			},
			themes: {
				light: {
					colors: { ...theme.colors },
				},
			},
		}),
	],
};
