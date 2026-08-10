import React, { useState, useEffect } from 'react';
import { X, Check, Target } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { type ExpenseCategory, EXPENSE_CATEGORIES } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: string | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
}) => {
  const { budgets, updateBudget, budgetStatuses } = useFinance();

  const [category, setCategory] = useState<ExpenseCategory>('Alimentation & Courses');
  const [limit, setLimit] = useState<string>('300');

  useEffect(() => {
    const targetCat = (selectedCategory as ExpenseCategory) || EXPENSE_CATEGORIES[0];
    setCategory(targetCat);

    const existingBudget = budgets.find((b) => b.category === targetCat);
    if (existingBudget) {
      setLimit(existingBudget.monthlyLimit.toString());
    } else {
      setLimit('300');
    }
  }, [selectedCategory, isOpen, budgets]);

  const handleCategoryChange = (newCat: ExpenseCategory) => {
    setCategory(newCat);
    const existingBudget = budgets.find((b) => b.category === newCat);
    if (existingBudget) {
      setLimit(existingBudget.monthlyLimit.toString());
    } else {
      setLimit('300');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit < 0) {
      alert('Veuillez saisir un plafond mensuel valide (≥ 0 €).');
      return;
    }

    updateBudget(category, parsedLimit);
    onClose();
  };

  if (!isOpen) return null;

  const currentStatus = budgetStatuses.find((bs) => bs.category === category);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={22} color="var(--accent-purple)" />
            <h2 style={{ fontSize: '1.2rem' }}>Plafond de Budget Mensuel</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Catégorie à configurer</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Plafond mensuel (€)</label>
            <input
              type="number"
              step="10"
              min="0"
              className="form-control"
              placeholder="ex: 400"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          {currentStatus && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-card)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '0.85rem',
                marginBottom: '20px',
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Aperçu actuel :</div>
              <div>
                Dépensé ce mois : <strong>{formatCurrency(currentStatus.currentSpent)}</strong>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              Enregistrer le plafond
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
