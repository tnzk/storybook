import { expect } from '@jest/globals';

import { composeConfigs } from './composeConfigs';

describe('composeConfigs', () => {
  it('sets default (empty) values for fields', () => {
    expect(composeConfigs([])).toEqual({
      parameters: {},
      decorators: [],
      args: {},
      argsEnhancers: [],
      argTypes: {},
      argTypesEnhancers: [],
      globals: {},
      globalTypes: {},
      loaders: [],
      runStep: expect.any(Function),
    });
  });

  it('composes parameters', () => {
    expect(
      composeConfigs([
        {
          parameters: { obj: { a: '1', b: '1' } },
        },
        {
          parameters: { obj: { a: '2', c: '2' } },
        },
      ])
    ).toEqual({
      parameters: { obj: { a: '2', b: '1', c: '2' } },
      decorators: [],
      args: {},
      argsEnhancers: [],
      argTypes: {},
      argTypesEnhancers: [],
      globals: {},
      globalTypes: {},
      loaders: [],
      runStep: expect.any(Function),
    });
  });

  it('composes export defaults', () => {
    expect(
      composeConfigs([
        {
          default: {
            parameters: { obj: { a: '1', b: '1' } },
          },
        },
        {
          default: {
            parameters: { obj: { a: '2', c: '2' } },
          },
        },
      ])
    ).toEqual({
      parameters: { obj: { a: '2', b: '1', c: '2' } },
      decorators: [],
      args: {},
      argsEnhancers: [],
      argTypes: {},
      argTypesEnhancers: [],
      globals: {},
      globalTypes: {},
      loaders: [],
      runStep: expect.any(Function),
    });
  });

  it('overrides object fields by key', () => {
    expect(
      composeConfigs([
        {
          default: {
            args: { x: '1', y: '1', obj: { a: '1', b: '1' } },
            argTypes: { x: '1', y: '1', obj: { a: '1', b: '1' } },
            globals: { x: '1', y: '1', obj: { a: '1', b: '1' } },
            globalTypes: { x: '1', y: '1', obj: { a: '1', b: '1' } },
          },
        },
        {
          default: {
            args: { x: '2', z: '2', obj: { a: '2', c: '2' } },
            argTypes: { x: '2', z: '2', obj: { a: '2', c: '2' } },
            globals: { x: '2', z: '2', obj: { a: '2', c: '2' } },
            globalTypes: { x: '2', z: '2', obj: { a: '2', c: '2' } },
          },
        },
      ])
    ).toEqual({
      parameters: {},
      decorators: [],
      args: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      argsEnhancers: [],
      argTypes: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      argTypesEnhancers: [],
      globals: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      globalTypes: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      loaders: [],
      runStep: expect.any(Function),
    });
  });

  it('overrides object fields by key with mixed named and default exports', () => {
    expect(
      // configs could come from user, addons, presets, frameworks.. so they will likely be mixed in format
      composeConfigs([
        {
          default: {
            args: { x: '1', y: '1', obj: { a: '1', b: '1' } },
            argTypes: { x: '1', y: '1', obj: { a: '1', b: '1' } },
            globals: { x: '1', y: '1', obj: { a: '1', b: '1' } },
            globalTypes: { x: '1', y: '1', obj: { a: '1', b: '1' } },
          },
        },
        {
          args: { x: '2', z: '2', obj: { a: '2', c: '2' } },
          argTypes: { x: '2', z: '2', obj: { a: '2', c: '2' } },
          globals: { x: '2', z: '2', obj: { a: '2', c: '2' } },
        },
        {
          default: {
            globalTypes: { x: '2', z: '2', obj: { a: '2', c: '2' } },
          },
        },
      ])
    ).toEqual({
      parameters: {},
      decorators: [],
      args: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      argsEnhancers: [],
      argTypes: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      argTypesEnhancers: [],
      globals: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      globalTypes: { x: '2', y: '1', z: '2', obj: { a: '2', c: '2' } },
      loaders: [],
      runStep: expect.any(Function),
    });
  });

  it('concats array fields', () => {
    expect(
      composeConfigs([
        {
          decorators: ['1', '2'],
          argsEnhancers: ['1', '2'],
          argTypesEnhancers: ['1', '2'],
          loaders: ['1', '2'],
        },
        {
          decorators: ['3', '4'],
          argsEnhancers: ['3', '4'],
          argTypesEnhancers: ['3', '4'],
          loaders: ['3', '4'],
        },
      ])
    ).toEqual({
      parameters: {},
      decorators: ['1', '2', '3', '4'],
      args: {},
      argsEnhancers: ['1', '2', '3', '4'],
      argTypes: {},
      argTypesEnhancers: ['1', '2', '3', '4'],
      globals: {},
      globalTypes: {},
      loaders: ['1', '2', '3', '4'],
      runStep: expect.any(Function),
    });
  });

  it('concats argTypesEnhancers in two passes', () => {
    expect(
      composeConfigs([
        { argTypesEnhancers: [{ a: '1' }, { a: '2', secondPass: true }] },
        { argTypesEnhancers: [{ a: '3' }, { a: '4', secondPass: true }] },
      ])
    ).toEqual({
      parameters: {},
      decorators: [],
      args: {},
      argsEnhancers: [],
      argTypes: {},
      argTypesEnhancers: [
        { a: '1' },
        { a: '3' },
        { a: '2', secondPass: true },
        { a: '4', secondPass: true },
      ],
      globals: {},
      globalTypes: {},
      loaders: [],
      runStep: expect.any(Function),
    });
  });

  it('concats chooses scalar fields', () => {
    expect(
      composeConfigs([
        {
          render: 'render-1',
          renderToCanvas: 'renderToCanvas-1',
          applyDecorators: 'applyDecorators-1',
        },
        {
          render: 'render-2',
          renderToCanvas: 'renderToCanvas-2',
          applyDecorators: 'applyDecorators-2',
        },
      ])
    ).toEqual({
      parameters: {},
      decorators: [],
      args: {},
      argsEnhancers: [],
      argTypes: {},
      argTypesEnhancers: [],
      globals: {},
      globalTypes: {},
      loaders: [],
      render: 'render-2',
      renderToCanvas: 'renderToCanvas-2',
      applyDecorators: 'applyDecorators-2',
      runStep: expect.any(Function),
    });
  });

  it('composes step runners', () => {
    const fn = jest.fn();

    const { runStep } = composeConfigs([
      // @ts-expect-error (not defined)
      { runStep: (label, play, context) => fn(`${label}1`, play(context)) },
      // @ts-expect-error (not defined)
      { runStep: (label, play, context) => fn(`${label}2`, play(context)) },
      // @ts-expect-error (not defined)
      { runStep: (label, play, context) => fn(`${label}3`, play(context)) },
    ]);

    // @ts-expect-error We don't care about the context value here
    runStep('Label', () => {}, {});

    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).toHaveBeenNthCalledWith(1, 'Label3', expect.anything());
    expect(fn).toHaveBeenNthCalledWith(2, 'Label2', expect.anything());
    expect(fn).toHaveBeenNthCalledWith(3, 'Label1', expect.anything());
  });
});
