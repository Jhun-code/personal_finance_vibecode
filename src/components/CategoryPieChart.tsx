import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart as PieIcon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryPieChart: React.FC = () => {
  const { expensesByCategory } = useFinance();

  if (expensesByCategory.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Aucune dépense enregistrée ce mois-ci pour afficher la répartition par catégorie.
      </div>
    );
  }

  const labels = expensesByCategory.map((item) => item.category);
  const dataValues = expensesByCategory.map((item) => item.amount);
  const backgroundColors = expensesByCategory.map(
    (item) => CATEGORY_COLORS[item.category] || '#64748b'
  );

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: '#111827',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const val = context.parsed;
            return ` Dépense: ${formatCurrency(val)}`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e',
          }}
        >
          <PieIcon size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>Répartition des Dépenses</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Par catégorie pour le mois en cours
          </p>
        </div>
      </div>

      <div style={{ height: '220px', width: '100%', position: 'relative', marginBottom: '20px' }}>
        <Doughnut data={data} options={options} />
      </div>

      {/* Custom Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
        {expensesByCategory.map((item) => (
          <div
            key={item.category}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.825rem',
              padding: '4px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: CATEGORY_COLORS[item.category] || '#64748b',
                }}
              />
              <span>{item.category}</span>
            </div>
            <div>
              <strong style={{ marginRight: '6px' }}>{formatCurrency(item.amount)}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
