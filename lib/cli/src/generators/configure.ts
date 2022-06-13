import fse from 'fs-extra';
import dedent from 'ts-dedent';
import { SupportedRenderers } from '../project_types';

interface ConfigureMainOptions {
  addons: string[];
  extensions?: string[];
  commonJs?: boolean;
  /**
   * Extra values for main.js
   *
   * In order to provide non-serializable data like functions, you can use
   * { value: '%%yourFunctionCall()%%' }
   *
   * '%% and %%' will be replace.
   *
   */
  [key: string]: any;
}

function configureMain({
  addons,
  extensions = ['js', 'jsx', 'ts', 'tsx'],
  commonJs = false,
  ...custom
}: ConfigureMainOptions) {
  const prefix = fse.existsSync('./src') ? '../src' : '../stories';

  const config = {
    stories: [`${prefix}/**/*.stories.mdx`, `${prefix}/**/*.stories.@(${extensions.join('|')})`],
    addons: addons.map((a) => `path.dirname(require.resolve(path.join('${a}', 'package.json')))`),
    ...custom,
  };

  // replace escaped values and delimiters
  const stringified = `module.exports = ${JSON.stringify(config, null, 2)
    .replace(/\\"/g, '"')
    .replace(/['"]%%/g, '')
    .replace(/%%['"]/, '')
    .replace(/\\n/g, '\r\n')
    // main.js isn't actually JSON, but we used JSON.stringify to convert the runtime-object into code.
    // un-stringify the value for referencing packages by string
    .replaceAll(/"(path\.dirname\(require\.resolve\(path\.join\('.*\))"/g, (_, a) => a)}`;
  fse.ensureDirSync('./.storybook');
  fse.writeFileSync(
    `./.storybook/main.${commonJs ? 'cjs' : 'js'}`,
    dedent`
      const path = require('path');
      ${stringified}
    `,
    { encoding: 'utf8' }
  );
}

const frameworkToPreviewParts: Partial<Record<SupportedRenderers, any>> = {
  angular: {
    prefix: dedent`
      import { setCompodocJson } from "@storybook/addon-docs/angular";
      import docJson from "../documentation.json";
      setCompodocJson(docJson);
      
      `.trimStart(),
    extraParameters: 'docs: { inlineStories: true },',
  },
};

function configurePreview(framework: SupportedRenderers, commonJs: boolean) {
  const { prefix = '', extraParameters = '' } = frameworkToPreviewParts[framework] || {};
  const previewPath = `./.storybook/preview.${commonJs ? 'cjs' : 'js'}`;

  // If the framework template included a preview then we have nothing to do
  if (fse.existsSync(previewPath)) {
    return;
  }

  const preview = dedent`
    ${prefix}
    export const parameters = {
      actions: { argTypesRegex: "^on[A-Z].*" },
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/,
        },
      },
      ${extraParameters}
    }`
    .replace('  \n', '')
    .trim();

  fse.writeFileSync(previewPath, preview, { encoding: 'utf8' });
}

export function configure(framework: SupportedRenderers, mainOptions: ConfigureMainOptions) {
  fse.ensureDirSync('./.storybook');

  configureMain(mainOptions);
  configurePreview(framework, mainOptions.commonJs);
}
