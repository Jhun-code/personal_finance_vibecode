import React from 'react';
import { Target, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

interface BudgetManagerProps {
  onOpenBudgetModal: (category?: string) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ onOpenBudgetModal }) => {
  const { budgetStatuses } = useFinance();

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6',
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Budgets Mensuels par Catégorie</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Plafonds de dépenses et suivi en temps réel
            </p>
          </div>
        </div>

        <button onClick={() => onOpenBudgetModal()} className="btn btn-secondary btn-sm">
          <Settings size={14} />
          Gérer les plafonds
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {budgetStatuses.map((status) => {
          let progressColor = '#10b981'; // Green
          if (status.isOverbudget) {
            progressColor = '#f43f5e'; // Red
          } else if (status.isNearLimit) {
            progressColor = '#f59e0b'; // Amber
          }

          return (
            <div
              key={status.category}
              style={{
                background: status.isOverbudget ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: status.isOverbudget
                  ? '1px solid rgba(244, 63, 94, 0.3)'
                  : '1px solid var(--border-card)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.925rem' }}>{status.category}</span>
                  {status.isOverbudget ? (
                    <span className="badge badge-danger">
                      <AlertTriangle size={12} />
                      Dépassement !
                    </span>
                  ) : status.isNearLimit ? (
                    <span className="badge badge-warning">
                      Attention ({status.percentage}%)
                    </span>
                  ) : (
                    <span className="badge badge-income" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> OK
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Consommé</span>
                  <span>
                    <strong style={{ color: status.isOverbudget ? '#f43f5e' : 'var(--text-main)' }}>
                      {formatCurrency(status.currentSpent)}
                    </strong>{' '}
                    / {formatCurrency(status.monthlyLimit)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(status.percentage, 100)}%`,
                      backgroundColor: progressColor,
                      boxShadow: status.isOverbudget ? '0 0 10px rgba(244, 63, 94, 0.5)' : 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  {status.isOverbudget
                    ? `Dépassement de ${formatCurrency(status.overbudgetAmount)}`
                    : `Reste : ${formatCurrency(Math.max(0, status.monthlyLimit - status.currentSpent))}`}
                </span>
                <button
                  onClick={() => onOpenBudgetModal(status.category)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.775rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Modifier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
