
// type ExpensesByPayeesModel -> expenseItems

// Import necessary modules and components
import { Table } from "react-bootstrap";
import IExpenseItem from "../models/expense";
import {
  getAllPayeeNames,
  getTotalContributedAmount,
  getGrandTotalExpenses,
} from "../services/expense-utils";

type ExpensesByPayeesModel = {
  expenseItems: IExpenseItem[];
};

const ExpensesByPayees = ({ expenseItems }: ExpensesByPayeesModel) => {
  return (
    <div>
      <h3>Payee View</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Payee Name</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {getAllPayeeNames(expenseItems).map((payeeName, index) => {
            const totalContributedAmount = getTotalContributedAmount(
              payeeName,
              expenseItems
            );
            const isNegative = totalContributedAmount < 0;

            return (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff", // Alternating row colors
                }}
              >
                <td>{index + 1}</td>
                <td>{payeeName}</td>
                <td style={{ color: isNegative ? "red" : "green" }}>
                  {totalContributedAmount}
                </td>
              </tr>
            );
          })}

          <tr>
            <td></td>
            <td>Grand Total</td>
            <td>{getGrandTotalExpenses(expenseItems)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export { ExpensesByPayees };
