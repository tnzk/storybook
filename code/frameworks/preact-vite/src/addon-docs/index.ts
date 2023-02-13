import { createUnplugin } from 'unplugin';
import type { Project } from 'ts-morph';
import { extractCSF, convertType } from '@krofdrakula/prop-docs-storybook';
import { getPropsType } from '@krofdrakula/prop-docs-preact';

interface Options {
  project: Project;
  storyMatcher?: (id: string) => boolean;
}

const STORY_MATCHER = /\.stories\.[tj]sx$/;

const defaultMatcher = (id: string) => STORY_MATCHER.test(id);

const unplugin = createUnplugin(({ project, storyMatcher = defaultMatcher }: Options) => {
  if (!project) throw new Error('Must provide a ts-morph Project instance!');
  return {
    name: 'unplugin-preact-addon-docs',
    transformInclude(id) {
      return storyMatcher(id);
    },
    transform(code, id) {
      let modified = code;
      project.createSourceFile(id, code);
      const stories = extractCSF(project, id, getPropsType);
      modified += '\n\n// ---(Component types detected)---\n';
      Object.entries(stories).forEach(([storyName, types]) => {
        const argTypes = convertType(types);
        modified += `${storyName}.argTypes = ${JSON.stringify(argTypes, null, 2)};\n\n`;
      });
      return modified;
    },
  };
});

export const vitePlugin = unplugin.vite;
export const webpackPlugin = unplugin.webpack;
export const esbuildPlugin = unplugin.esbuild;
export const rollupPlugin = unplugin.rollup;
