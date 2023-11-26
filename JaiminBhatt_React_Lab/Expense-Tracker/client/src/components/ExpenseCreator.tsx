import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import IExpenseItem, { IExpenseCreateItem } from "../models/expense";
import { getAllPayeeNames } from "../services/expense-utils";
import { FormEvent, useRef } from "react";
import { createNewExpenseItem } from "../services/expense-service";

type ExpenseCreatorModel = {
  expenseItems: IExpenseItem[];
  refresh: (newExpenseItem: IExpenseItem) => void;
};

const ExpenseCreator = ({ expenseItems, refresh }: ExpenseCreatorModel) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const expenseDescriptionRef = useRef<HTMLInputElement>(null);
  const payeeNameRef = useRef<HTMLSelectElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const expenseDateRef = useRef<HTMLInputElement>(null);

  const handleExpenseCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payeeName = payeeNameRef?.current?.value as string;

    if (payeeName === "SELECT A PAYEE") {
      alert("Please select a valid payee.");
      return;
    }

    const expenseDescription = expenseDescriptionRef?.current?.value as string;
    const price = parseFloat(priceRef?.current?.value as string);
    const expenseDate = new Date(expenseDateRef?.current?.value as string);

    const newExpenseItemObj: IExpenseCreateItem = {
      expenseDescription: expenseDescription,
      payeeName: payeeName,
      price: price,
      date: expenseDate,
    };

    const response = await createNewExpenseItem(newExpenseItemObj);

    refresh(response);

    console.log("Response is");
    console.log(response);

    handleClose();
  };

  const createExpenseModalBody = () => {
    return (
      <Form onSubmit={handleExpenseCreate}>
        <Form.Group className="mb-3" controlId="expenseDescription">
          <Form.Label>Expense Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter expense description"
            ref={expenseDescriptionRef}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="payeeName">
          <Form.Label>Payee Name</Form.Label>
          <Form.Select aria-label="Default select example" ref={payeeNameRef} required>
            <option>SELECT A PAYEE</option>
            {getAllPayeeNames(expenseItems).map((payeeName) => (
              <option key={payeeName} value={payeeName}>
                {payeeName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter expense price"
            ref={priceRef}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="expenseDate">
          <Form.Label>Expense Date</Form.Label>
          <Form.Control
            type="date"
            ref={expenseDateRef}
            max={getCurrentDate()}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          New Expense
        </Button>

        <Button className="float-end" variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Form>
    );
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  return (
    <div>
      <Button className="float-end" variant="primary" onClick={handleShow}>
        New Expense Item
      </Button>
      <br></br>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>{createExpenseModalBody()}</Modal.Body>
      </Modal>
    </div>
  );
};

export { ExpenseCreator };
