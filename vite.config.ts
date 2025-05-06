import { execSync } from "node:child_process";
import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import UnoCSS from "unocss/vite";
// vite.config.ts
import { type Plugin, defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import SemiPlugin from "./src/lib/semi";

// Plugin to get Git hash
function gitHashPlugin(): Plugin {
	return {
		name: "git-hash-plugin",
		config: () => {
			const hash = execSync("git rev-parse HEAD").toString().trim();
			return {
				define: {
					__GIT_HASH__: JSON.stringify(hash),
				},
			};
		},
	};
}

export default defineConfig(({ mode }) => {
	// Set the third parameter to "" to load all environment variables,
	// regardless of whether they exist or not 'VITE_' prefix.
	const env = loadEnv(mode, process.cwd(), "");
	env.BASE_PATH && console.debug("Using custom base path:", env.BASE_PATH);
	return {
		base: env.BASE_PATH || "/",
		plugins: [
			tsconfigPaths({ root: "./" }),
			react(),
			UnoCSS(),
			TanStackRouterVite(),
			SemiPlugin({
				theme: "@semi-bot/semi-theme-meilisearch",
			}),
			gitHashPlugin(),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			host: true,
			port: 24900,
			strictPort: true,
			allowedHosts: env.ALLOWED_HOSTS?.split(",") || true,
		},
		css: {
			modules: {
				localsConvention: "camelCaseOnly",
			},
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						// node_modules is mostly the main reason for the large chunk problem,
						// With this you're telling Vite to treat the used modules separately.
						// To understand better what it does,
						// try to compare the logs from the build command with and without this change.
						if (id.includes("node_modules")) {
							const importStrArr = id.toString().split("node_modules/");
							return importStrArr[importStrArr.length - 1]
								.split("/")[0]
								.toString();
						}
					},
				},
			},
		},
	};
});
