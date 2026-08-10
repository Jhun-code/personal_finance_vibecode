import React from 'react';
import { AlertOctagon, Settings } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

interface AlertBannerProps {
  onOpenBudgetModal: (category?: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ onOpenBudgetModal }) => {
  const { activeAlerts } = useFinance();

  if (activeAlerts.length === 0) {
    return null;
  }

  return (
    <div
      className="glass-card"
      style={{
        marginBottom: '24px',
        padding: '18px 24px',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(17, 24, 39, 0.9))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e',
          }}
        >
          <AlertOctagon size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', color: '#f43f5e' }}>
            Alerte Dépassement de Budget ({activeAlerts.length})
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Vos dépenses du mois dépassent le plafond défini pour les catégories ci-dessous :
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {activeAlerts.map((alert) => (
          <div
            key={alert.category}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {alert.category}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Dépensé: <span style={{ color: '#f43f5e', fontWeight: 600 }}>{formatCurrency(alert.currentSpent)}</span> / {formatCurrency(alert.monthlyLimit)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600, marginTop: '2px' }}>
                + {formatCurrency(alert.overbudgetAmount)} de dépassement ({alert.percentage}%)
              </div>
            </div>

            <button
              onClick={() => onOpenBudgetModal(alert.category)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '4px', padding: '6px 10px', fontSize: '0.75rem' }}
              title="Ajuster le budget"
            >
              <Settings size={14} />
              Ajuster
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
