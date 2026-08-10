import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { SummaryCards } from './components/SummaryCards';
import { BalanceChart } from './components/BalanceChart';
import { CategoryPieChart } from './components/CategoryPieChart';
import { BudgetManager } from './components/BudgetManager';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import type { Transaction } from './types/finance';

const MainDashboard: React.FC = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [targetCategoryForBudget, setTargetCategoryForBudget] = useState<string | null>(null);

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTransactionModalOpen(true);
  };

  const handleOpenBudgetModal = (category?: string) => {
    setTargetCategoryForBudget(category || null);
    setIsBudgetModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Header Bar */}
      <Header onOpenAddModal={handleOpenAddTransaction} />

      {/* Global Overbudget Alert Banner */}
      <AlertBanner onOpenBudgetModal={handleOpenBudgetModal} />

      {/* Summary KPI Cards */}
      <SummaryCards />

      {/* Charts Grid */}
      <div className="dashboard-grid-2col" style={{ marginBottom: '24px' }}>
        <BalanceChart />
        <CategoryPieChart />
      </div>

      {/* Monthly Budget Manager & Alerts */}
      <div style={{ marginBottom: '24px' }}>
        <BudgetManager onOpenBudgetModal={handleOpenBudgetModal} />
      </div>

      {/* Transactions List & Filter */}
      <TransactionList onEditTransaction={handleEditTransaction} />

      {/* Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        initialData={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        selectedCategory={targetCategoryForBudget}
      />
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <MainDashboard />
    </FinanceProvider>
  );
}

export default App;
