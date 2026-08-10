export type TransactionType = 'income' | 'expense';

export type IncomeCategory =
  | 'Salaire'
  | 'Freelance'
  | 'Investissements'
  | 'Vente'
  | 'Cadeaux'
  | 'Autre Revenu';

export type ExpenseCategory =
  | 'Alimentation & Courses'
  | 'Logement & Loyer'
  | 'Transports'
  | 'Loisirs & Sorties'
  | 'Santé'
  | 'Factures & Abonnements'
  | 'Shopping & Achats'
  | 'Éducation'
  | 'Autre Dépense';

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export const INCOME_CATEGORIES: IncomeCategory[] = [
  'Salaire',
  'Freelance',
  'Investissements',
  'Vente',
  'Cadeaux',
  'Autre Revenu',
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Alimentation & Courses',
  'Logement & Loyer',
  'Transports',
  'Loisirs & Sorties',
  'Santé',
  'Factures & Abonnements',
  'Shopping & Achats',
  'Éducation',
  'Autre Dépense',
];

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: TransactionCategory;
  date: string; // ISO String format YYYY-MM-DD
  notes?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface BudgetStatus {
  category: ExpenseCategory;
  monthlyLimit: number;
  currentSpent: number;
  percentage: number;
  overbudgetAmount: number;
  isOverbudget: boolean;
  isNearLimit: boolean;
}

export interface MetricSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  activeAlertsCount: number;
}

export interface BalanceHistoryPoint {
  date: string;
  rawDate: string;
  balance: number;
  income: number;
  expense: number;
}
