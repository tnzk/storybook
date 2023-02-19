import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import preact from '@preact/preset-vite';
import { Project, ts } from 'ts-morph';
import type { StorybookConfig } from './types';
import { vite as vitePlugin } from './addon-docs';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/preact',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const { plugins = [] } = config;

  // Add Preact plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite:preact-jsx']))) {
    plugins.push(preact());
  }

  plugins.push(
    vitePlugin({
      project: new Project({
        compilerOptions: {
          target: ts.ScriptTarget.ESNext,
          allowJs: true,
          jsx: ts.JsxEmit.ReactJSX,
          jsxImportSource: 'preact',
        },
      }),
    })
  );

  return config;
};
