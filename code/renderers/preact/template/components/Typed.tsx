/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-a11y/control-has-associated-label */
import type { FunctionalComponent } from 'preact';

interface Props {
  /** The account owner's name */
  owner: string;
  /** The amount to allow overdrawing */
  allowance: number;
  /** A list of expenses for the given account, negative means outflow */
  expenses: { amount: number; note: string }[];
}

const formatMoney = (amount: number): string =>
  amount.toLocaleString('en-US', {
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    style: 'currency',
  });

export const BalanceSheet: FunctionalComponent<Props> = ({ expenses, owner, allowance }) => {
  const sum = expenses.reduce((acc, next) => acc + next.amount, 0);

  return (
    <>
      <style>{`
        .finance {
          border-collapse: collapse;
        }

        .finance td, .finance th {
          border: 1px solid #ccc;
          padding: 2px 6px;
        }

        .finance .number {
          text-align: right;
        }
      `}</style>
      <h1>Expenses for {owner}</h1>
      <table className="finance">
        <thead>
          <tr>
            <th />
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(({ amount, note }) => (
            <tr>
              <th />
              <td className="number">{formatMoney(amount)}</td>
              <td>{note}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Total:</th>
            <td className="number">
              <strong>{formatMoney(sum)}</strong>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
      <p>
        {allowance + sum < 0 ? (
          <strong>Warning: account is overdrawn!</strong>
        ) : (
          `Account is within allowance.`
        )}
      </p>
    </>
  );
};
