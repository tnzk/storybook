import type { ComponentProps } from 'preact';
import type { StoryObj } from 'renderers/preact/src';
import { BalanceSheet } from './Typed';

export default {
  title: 'Typed Test',
  component: BalanceSheet,
};

export const Basic: StoryObj<ComponentProps<typeof BalanceSheet>> = {
  args: { expenses: [{ amount: -300, note: 'Services bill' }] },
};
