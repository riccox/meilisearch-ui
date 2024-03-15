/**
 * Clone From: https://github.com/boenfu/vite-plugin-semi-theme/blob/main/index.js
 *
 * PNPM 定制Semi DSM 替换 Plugin
 */
import FS from 'fs';
import Path from 'path';

import { pathToFileURL } from 'url';

import pkg from 'sass';
import { platform } from 'os';
const { compileString, Logger } = pkg;

/**
 * @type {(options:{
 *  theme: string;
 *  options?: {
 *    prefixCls?: string;
 *     variables?: {[key: string]: string | number};
 *    include?: string;
 *  };
 * })=>any}
 *
 * @note 阅读 webpack 版本代码的理解
 * 1. 解析 css 到对应 scss
 * 2. 替换 scss 内容
 * 3. 再构建成对应的 css
 */
export default function SemiPlugin({ theme, options = {} }) {
  return {
    name: 'semi-theme',
    enforce: 'post',
    load(id) {
      const filePath = normalizePath(id);
      if (options.include) {
        options.include = normalizePath(options.include);
      }
      // https://github.com/DouyinFE/semi-design/blob/main/packages/semi-webpack/src/semi-webpack-plugin.ts#L83
      if (/@douyinfe\/semi-(ui|icons|foundation)\/lib\/.+\.css$/.test(filePath)) {
        const scssFilePath = filePath.replace(/\.css$/, '.scss');

        // 目前只有 name
        // https://github.com/DouyinFE/semi-design/blob/04d17a72846dfb5452801a556b6e01f9b0e8eb9d/packages/semi-webpack/src/semi-webpack-plugin.ts#L23
        const semiSemiLoaderOptions = { name: theme };

        return compileString(
          // TODO (boen): 未解析 file query
          loader(FS.readFileSync(scssFilePath), {
            ...semiSemiLoaderOptions,
            ...options,
            variables: convertMapToString(options.variables || {}),
          }),
          {
            importers: [
              {
                findFileUrl(url) {
                  if (url.startsWith('~')) {
                    const key = '/node_modules/';
                    return new URL(
                      url.substring(1),
                      pathToFileURL(
                        scssFilePath.substring(
                          0,
                          (url.startsWith('~@semi-bot') ? scssFilePath.indexOf(key) : scssFilePath.lastIndexOf(key)) +
                            key.length
                        )
                      )
                    );
                  }

                  const filePath = Path.resolve(Path.dirname(scssFilePath), url);

                  if (FS.existsSync(filePath)) {
                    return pathToFileURL(filePath);
                  }

                  return null;
                },
              },
            ],
            logger: Logger.silent,
          }
        ).css;
      }
    },
  };
}

// copy from https://github.com/DouyinFE/semi-design/blob/main/packages/semi-webpack/src/semi-theme-loader.ts
function loader(source, options) {
  let fileStr = source.toString('utf8');

  const theme = options.name || '@douyinfe/semi-theme-default';
  // always inject
  const scssVarStr = `@import "~${theme}/scss/index.scss";\n`;
  // inject once
  const cssVarStr = `@import "~${theme}/scss/global.scss";\n`;
  // [vite-plugin]: sync from https://github.com/DouyinFE/semi-design/commit/a6064489a683495a737cbe7abd72c0b49a3bcd06
  let animationStr = `@import "~${theme}/scss/animation.scss";\n`;

  try {
    require.resolve(`${theme}/scss/animation.scss`);
  } catch (e) {
    animationStr = ''; // fallback to empty string
  }

  const shouldInject = fileStr.includes('semi-base');

  let componentVariables;

  try {
    componentVariables = resolve.sync(this.context, `${theme}/scss/local.scss`);
  } catch (e) {}

  if (options.include || options.variables || componentVariables) {
    let localImport = '';
    if (componentVariables) {
      localImport += `\n@import "~${theme}/scss/local.scss";`;
    }
    if (options.include) {
      localImport += `\n@import "${options.include}";`;
    }
    if (options.variables) {
      localImport += `\n${options.variables}`;
    }
    try {
      const regex = /(@import '.\/variables.scss';?|@import ".\/variables.scss";?)/g;
      const fileSplit = fileStr.split(regex).filter((item) => Boolean(item));
      if (fileSplit.length > 1) {
        fileSplit.splice(fileSplit.length - 1, 0, localImport);
        fileStr = fileSplit.join('');
      }
    } catch (error) {}
  }

  // inject prefix
  const prefixCls = options.prefixCls || 'semi';

  const prefixClsStr = `$prefix: '${prefixCls}';\n`;

  if (shouldInject) {
    return `${animationStr}${cssVarStr}${scssVarStr}${prefixClsStr}${fileStr}`;
  } else {
    return `${scssVarStr}${prefixClsStr}${fileStr}`;
  }
}

// copy from https://github.com/DouyinFE/semi-design/blob/main/packages/semi-webpack/src/semi-webpack-plugin.ts#L136
function convertMapToString(map) {
  return Object.keys(map).reduce(function (prev, curr) {
    return prev + `${curr}: ${map[curr]};\n`;
  }, '');
}

function normalizePath(id) {
  return Path.posix.normalize(platform() === 'win32' ? id.replace(/\\/g, '/') : id);
}
