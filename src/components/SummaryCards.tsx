import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const SummaryCards: React.FC = () => {
  const { summary } = useFinance();

  return (
    <div className="summary-grid">
      {/* Solde Total */}
      <div className="glass-card metric-card">
        <div className="metric-header">
          <span className="metric-title">Solde Total</span>
          <div className="metric-icon-box" style={{ color: 'var(--accent-cyan)' }}>
            <Wallet size={22} />
          </div>
        </div>
        <div>
          <div className="metric-value" style={{ color: summary.totalBalance >= 0 ? '#f8fafc' : '#f43f5e' }}>
            {formatCurrency(summary.totalBalance)}
          </div>
          <div className="metric-sub">
            <span>Solde net disponible</span>
          </div>
        </div>
      </div>

      {/* Revenus du Mois */}
      <div className="glass-card metric-card income">
        <div className="metric-header">
          <span className="metric-title">Revenus du Mois</span>
          <div className="metric-icon-box" style={{ color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
            <TrendingUp size={22} />
          </div>
        </div>
        <div>
          <div className="metric-value" style={{ color: '#10b981' }}>
            + {formatCurrency(summary.monthlyIncome)}
          </div>
          <div className="metric-sub">
            <span className="badge badge-income">Entrées du mois</span>
          </div>
        </div>
      </div>

      {/* Dépenses du Mois */}
      <div className="glass-card metric-card expense">
        <div className="metric-header">
          <span className="metric-title">Dépenses du Mois</span>
          <div className="metric-icon-box" style={{ color: 'var(--accent-rose)', background: 'rgba(244, 63, 94, 0.1)' }}>
            <TrendingDown size={22} />
          </div>
        </div>
        <div>
          <div className="metric-value" style={{ color: '#f43f5e' }}>
            - {formatCurrency(summary.monthlyExpenses)}
          </div>
          <div className="metric-sub">
            <span className="badge badge-expense">Sorties du mois</span>
          </div>
        </div>
      </div>

      {/* Taux d'Épargne */}
      <div className="glass-card metric-card">
        <div className="metric-header">
          <span className="metric-title">Taux d'Épargne</span>
          <div className="metric-icon-box" style={{ color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)' }}>
            <PiggyBank size={22} />
          </div>
        </div>
        <div>
          <div className="metric-value" style={{ color: '#8b5cf6' }}>
            {summary.savingsRate}%
          </div>
          <div className="metric-sub">
            <span>du revenu conservé ce mois</span>
          </div>
        </div>
      </div>
    </div>
  );
};
