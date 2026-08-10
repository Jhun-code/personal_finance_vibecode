import React, { useState, useEffect } from 'react';
import { X, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import {
  type Transaction,
  type TransactionType,
  type TransactionCategory,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '../types/finance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addTransaction, updateTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('Alimentation & Courses');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNotes(initialData.notes || '');
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory('Alimentation & Courses');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [initialData, isOpen]);

  // Adjust category when type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Veuillez remplir correctement le titre et un montant valide supérieur à 0.');
      return;
    }

    if (initialData) {
      updateTransaction(initialData.id, {
        type,
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        notes: notes.trim(),
      });
    } else {
      addTransaction({
        type,
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  const categoryOptions = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>
            {initialData ? 'Modifier la Transaction' : 'Nouvelle Transaction'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type Selector Toggle */}
          <div className="form-group">
            <label className="form-label">Type d'opération</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
                onClick={() => handleTypeChange('expense')}
              >
                <ArrowDownRight size={18} /> Dépense (Sortie)
              </button>
              <button
                type="button"
                className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'center' }}
                onClick={() => handleTypeChange('income')}
              >
                <ArrowUpRight size={18} /> Revenu (Entrée)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Titre de la transaction *</label>
            <input
              type="text"
              className="form-control"
              placeholder="ex: Courses Carrefour, Salaire..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Amount & Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Montant (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Catégorie *</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes ou commentaires (optionnel)</label>
            <input
              type="text"
              className="form-control"
              placeholder="ex: Facture #1234, détails..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              {initialData ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
