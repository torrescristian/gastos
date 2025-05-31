export type Expense = {
  id?: string;
  amount: number;
  categoryId: string;
  subcategoryId?: string | null;
  isCardPayment: boolean;
  note?: string | null;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
