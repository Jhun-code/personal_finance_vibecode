import React from 'react';
import { Wallet, PlusCircle, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  const { summary, resetToMockData } = useFinance();

  return (
    <header className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)',
            }}
          >
            <Wallet size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.45rem', lineHeight: '1.2' }}>FinancePulse</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gestion de finances personnelles & alerte budget
            </p>
          </div>
        </div>

        {/* Action Controls & Alert Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {summary.activeAlertsCount > 0 ? (
            <div className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '0.825rem' }}>
              <AlertTriangle size={15} />
              <span>{summary.activeAlertsCount} budget(s) dépassé(s)</span>
            </div>
          ) : (
            <div className="badge badge-income" style={{ padding: '6px 12px', fontSize: '0.825rem' }}>
              <ShieldCheck size={15} />
              <span>Budgets sous contrôle</span>
            </div>
          )}

          <button
            onClick={resetToMockData}
            className="btn btn-secondary btn-sm"
            title="Réinitialiser les données de test"
          >
            <RotateCcw size={15} />
            <span style={{ display: 'inline' }}>Données démo</span>
          </button>

          <button onClick={onOpenAddModal} className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Nouvelle Transaction</span>
          </button>
        </div>

      </div>
    </header>
  );
};
