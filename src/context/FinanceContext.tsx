import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  Transaction,
  CategoryBudget,
  BudgetStatus,
  MetricSummary,
  BalanceHistoryPoint,
  ExpenseCategory,
} from '../types/finance';
import { EXPENSE_CATEGORIES } from '../types/finance';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from '../utils/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: CategoryBudget[];
  summary: MetricSummary;
  budgetStatuses: BudgetStatus[];
  activeAlerts: BudgetStatus[];
  balanceHistory: BalanceHistoryPoint[];
  expensesByCategory: { category: ExpenseCategory; amount: number; percentage: number }[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: ExpenseCategory, monthlyLimit: number) => void;
  resetToMockData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const LOCAL_STORAGE_TX_KEY = 'vibecode_finance_transactions_v1';
const LOCAL_STORAGE_BUDGET_KEY = 'vibecode_finance_budgets_v1';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_TX_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved transactions', e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_BUDGET_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved budgets', e);
      }
    }
    return INITIAL_BUDGETS;
  });

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TX_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_BUDGET_KEY, JSON.stringify(budgets));
  }, [budgets]);

  // Derived: Current Month transactions
  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date + 'T00:00:00');
      return txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth;
    });
  }, [transactions]);

  // Calculate Budget Statuses & Overbudget Alerts
  const budgetStatuses: BudgetStatus[] = useMemo(() => {
    return EXPENSE_CATEGORIES.map((category) => {
      const budgetObj = budgets.find((b) => b.category === category);
      const monthlyLimit = budgetObj ? budgetObj.monthlyLimit : 0;

      const currentSpent = currentMonthTransactions
        .filter((tx) => tx.type === 'expense' && tx.category === category)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const percentage = monthlyLimit > 0 ? Math.round((currentSpent / monthlyLimit) * 100) : 0;
      const overbudgetAmount = currentSpent - monthlyLimit;

      return {
        category,
        monthlyLimit,
        currentSpent,
        percentage,
        overbudgetAmount: overbudgetAmount > 0 ? overbudgetAmount : 0,
        isOverbudget: monthlyLimit > 0 && currentSpent > monthlyLimit,
        isNearLimit: monthlyLimit > 0 && currentSpent >= monthlyLimit * 0.8 && currentSpent <= monthlyLimit,
      };
    });
  }, [budgets, currentMonthTransactions]);

  const activeAlerts = useMemo(() => {
    return budgetStatuses.filter((bs) => bs.isOverbudget);
  }, [budgetStatuses]);

  // Calculate Summary metrics
  const summary: MetricSummary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    const monthlyIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlyExpenses = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const savingsRate = monthlyIncome > 0
      ? Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100))
      : 0;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      activeAlertsCount: activeAlerts.length,
    };
  }, [transactions, currentMonthTransactions, activeAlerts]);

  // Compute Balance History over time
  const balanceHistory: BalanceHistoryPoint[] = useMemo(() => {
    if (transactions.length === 0) return [];

    // Sort transactions chronologically
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulativeBalance = 0;
    const historyMap = new Map<string, { income: number; expense: number; balance: number }>();

    sorted.forEach((tx) => {
      const dateKey = tx.date;
      const prev = historyMap.get(dateKey) || { income: 0, expense: 0, balance: 0 };
      if (tx.type === 'income') {
        prev.income += tx.amount;
        cumulativeBalance += tx.amount;
      } else {
        prev.expense += tx.amount;
        cumulativeBalance -= tx.amount;
      }
      prev.balance = cumulativeBalance;
      historyMap.set(dateKey, prev);
    });

    const points: BalanceHistoryPoint[] = [];
    historyMap.forEach((val, dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
      }).format(d);

      points.push({
        date: formattedDate,
        rawDate: dateStr,
        balance: val.balance,
        income: val.income,
        expense: val.expense,
      });
    });

    return points;
  }, [transactions]);

  // Compute Expenses breakdown by category
  const expensesByCategory = useMemo(() => {
    const totalSpentThisMonth = currentMonthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const map = new Map<ExpenseCategory, number>();
    currentMonthTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        const cat = tx.category as ExpenseCategory;
        map.set(cat, (map.get(cat) || 0) + tx.amount);
      });

    const result: { category: ExpenseCategory; amount: number; percentage: number }[] = [];
    map.forEach((amount, category) => {
      const percentage = totalSpentThisMonth > 0 ? Math.round((amount / totalSpentThisMonth) * 100) : 0;
      result.push({ category, amount, percentage });
    });

    return result.sort((a, b) => b.amount - a.amount);
  }, [currentMonthTransactions]);

  // Actions
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudget = (category: ExpenseCategory, monthlyLimit: number) => {
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === category);
      if (exists) {
        return prev.map((b) => (b.category === category ? { category, monthlyLimit } : b));
      } else {
        return [...prev, { category, monthlyLimit }];
      }
    });
  };

  const resetToMockData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    localStorage.removeItem(LOCAL_STORAGE_TX_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BUDGET_KEY);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        summary,
        budgetStatuses,
        activeAlerts,
        balanceHistory,
        expensesByCategory,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        resetToMockData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
