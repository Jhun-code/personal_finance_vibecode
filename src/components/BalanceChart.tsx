import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Calendar } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const BalanceChart: React.FC = () => {
  const { balanceHistory } = useFinance();

  if (balanceHistory.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Aucune transaction enregistrée pour afficher la courbe d'évolution du solde.
      </div>
    );
  }

  const labels = balanceHistory.map((pt) => pt.date);
  const dataValues = balanceHistory.map((pt) => pt.balance);

  const data = {
    labels,
    datasets: [
      {
        label: 'Solde Cumulé (€)',
        data: dataValues,
        borderColor: '#06b6d4',
        borderWidth: 3,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        pointRadius: 4,
        tension: 0.35,
        fill: true,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
          return gradient;
        },
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
        bodyColor: '#06b6d4',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            return ` Solde: ${formatCurrency(val)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11,
          },
          callback: (value: any) => `${value} €`,
        },
      },
    },
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4',
            }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Évolution du Solde</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Trajectoire temporelle du solde disponible
            </p>
          </div>
        </div>

        <div className="badge badge-income" style={{ gap: '6px' }}>
          <Calendar size={13} />
          <span>Historique Global</span>
        </div>
      </div>

      <div style={{ height: '300px', width: '100%' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
