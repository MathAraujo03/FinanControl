export type CardName =
  | 'Azul MC Platinum'
  | 'Itaú Visa Platinum'
  | 'Nubank'
  | 'Bradesco Visa Platinum'
  | 'Carrefour'
  | 'Porto Bank';

export interface Income {
  id: string;
  source: string;
  value: number;
  date: string;
}

export interface Investment {
  id: string;
  destination: string;
  value: number;
  date: string;
}

export interface Expense {
  id: string;
  source: string;
  value: number;
  date: string;
  category?: string;
}

export interface CardExpense {
  id: string;
  card: CardName;
  description: string;
  value: number;
  date: string;
  isInstallment: boolean;
  installmentsCount?: number;
}

export type PaymentMethod = 'Cartão de crédito' | 'Débito' | 'Pix' | 'Dinheiro';

export interface WeeklyExpense {
  id: string;
  description: string;
  value: number;
  date: string;
  paymentMethod: PaymentMethod;
  weekIndex: number; // 0-4
}

export interface FinanceState {
  incomes: Income[];
  investments: Investment[];
  expenses: Expense[];
  cardExpenses: CardExpense[];
  weeklyExpenses: WeeklyExpense[];
  weeksCount: 4 | 5;
  theme: 'light' | 'dark';
}
