import { createUnplugin } from 'unplugin';
import type { Project } from 'ts-morph';
import { extractCSF, convertType } from '@krofdrakula/prop-docs-storybook';
import { getPropsType } from '@krofdrakula/prop-docs-preact';

interface Options {
  project: Project;
  storyMatcher?: (id: string) => boolean;
}

const STORY_MATCHER = /\.(story|stories)\.[tj]sx$/;

const defaultMatcher = (id: string) => STORY_MATCHER.test(id);

const unplugin = createUnplugin<Options>(({ project, storyMatcher = defaultMatcher }) => {
  if (!project) throw new Error('Must provide a ts-morph Project instance!');
  return {
    name: 'unplugin-preact-addon-docs',
    enforce: 'pre',
    transformInclude(id) {
      return storyMatcher(id);
    },
    transform(code, id) {
      let modified = code;
      project.createSourceFile(id, code, { overwrite: true });
      const stories = extractCSF(project, id, getPropsType);
      modified += '\n\n// ---(Component types detected)---\n';
      // eslint-disable-next-line no-restricted-syntax
      for (const [storyName, types] of Object.entries(stories)) {
        const argTypes = convertType(types);
        modified += `${storyName}.argTypes = Object.assign(
  ${JSON.stringify(argTypes)},
  ${storyName}.argTypes ?? {}
);\n\n`;
      }
      return modified;
    },
  };
});

export const { esbuild, rollup, vite, webpack } = unplugin;
