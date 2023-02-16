/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import type { FunctionalComponent } from 'preact';

interface Props {
  owner: string;
  allowance: number;
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
      <h1>Expenses for {owner}</h1>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(({ amount, note }) => (
            <tr>
              <td>{formatMoney(amount)}</td>
              <td>{note}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              Total: <strong>{formatMoney(sum)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
      <p>
        {allowance - sum < 0 ? (
          <strong>Warning: account is overdrawn!</strong>
        ) : (
          `Account is within allowance.`
        )}
      </p>
    </>
  );
};
