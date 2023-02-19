import type { StoryObj } from '@storybook/preact';
import type { ComponentProps } from 'preact';
import { BalanceSheet } from './Typed';

export default {
  title: 'Typed Test',
  tags: ['autodocs'],
  component: BalanceSheet,
};

export const Basic: StoryObj<ComponentProps<typeof BalanceSheet>> = {
  args: {
    expenses: [
      { amount: -300, note: 'Services bill' },
      { amount: Math.PI, note: 'π income' },
    ],
    allowance: 200,
    owner: 'James Blunt',
  },
};
