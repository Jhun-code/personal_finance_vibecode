import React, { useState, useMemo } from 'react';
import {
  Search,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownRight,
  ListFilter,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import type { Transaction, TransactionCategory, TransactionType } from '../types/finance';
import { formatCurrency, formatDateFr, CATEGORY_COLORS } from '../utils/formatters';

interface TransactionListProps {
  onEditTransaction: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onEditTransaction }) => {
  const { transactions, deleteTransaction } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchCategory = tx.category.toLowerCase().includes(query);
        const matchNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        return matchTitle || matchCategory || matchNotes;
      }
      return true;
    });
  }, [transactions, searchTerm, selectedType, selectedCategory]);

  // Unique categories in dataset
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header & Filter Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <ListFilter size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Historique des Transactions</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {filteredTransactions.length} transaction(s) trouvée(s)
              </p>
            </div>
          </div>
        </div>

        {/* Filter Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="Rechercher par titre, note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Selector */}
          <select
            className="form-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TransactionType | 'all')}
          >
            <option value="all">Tous les types (Revenus & Dépenses)</option>
            <option value="income">Entrées uniquement (Revenus)</option>
            <option value="expense">Sorties uniquement (Dépenses)</option>
          </select>

          {/* Category Selector */}
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Aucune transaction ne correspond à vos critères de recherche.
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction</th>
                <th>Catégorie</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Montant</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const catColor = CATEGORY_COLORS[tx.category as TransactionCategory] || '#64748b';

                return (
                  <tr key={tx.id}>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDateFr(tx.date)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tx.title}</div>
                      {tx.notes && (
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-subtle)' }}>{tx.notes}</div>
                      )}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${catColor}20`,
                          color: catColor,
                          border: `1px solid ${catColor}40`,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      {isIncome ? (
                        <span className="badge badge-income">
                          <ArrowUpRight size={14} /> Revenu
                        </span>
                      ) : (
                        <span className="badge badge-expense">
                          <ArrowDownRight size={14} /> Dépense
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: isIncome ? '#10b981' : '#f43f5e',
                        }}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => onEditTransaction(tx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Modifier"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer "${tx.title}" ?`)) {
                              deleteTransaction(tx.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f43f5e',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
