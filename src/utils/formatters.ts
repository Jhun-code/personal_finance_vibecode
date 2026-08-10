import type { TransactionCategory } from '../types/finance';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDateFr = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  // Income
  Salaire: '#10b981', // Emerald
  Freelance: '#06b6d4', // Cyan
  Investissements: '#8b5cf6', // Purple
  Vente: '#f59e0b', // Amber
  Cadeaux: '#ec4899', // Pink
  'Autre Revenu': '#14b8a6', // Teal

  // Expenses
  'Alimentation & Courses': '#f97316', // Orange
  'Logement & Loyer': '#6366f1', // Indigo
  Transports: '#3b82f6', // Blue
  'Loisirs & Sorties': '#ec4899', // Pink
  Santé: '#ef4444', // Red
  'Factures & Abonnements': '#a855f7', // Purple
  'Shopping & Achats': '#eab308', // Yellow
  Éducation: '#0284c7', // Sky
  'Autre Dépense': '#64748b', // Slate
};

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  Salaire: 'Briefcase',
  Freelance: 'Laptop',
  Investissements: 'TrendingUp',
  Vente: 'ShoppingBag',
  Cadeaux: 'Gift',
  'Autre Revenu': 'PlusCircle',

  'Alimentation & Courses': 'Utensils',
  'Logement & Loyer': 'Home',
  Transports: 'Car',
  'Loisirs & Sorties': 'Sparkles',
  Santé: 'HeartPulse',
  'Factures & Abonnements': 'Receipt',
  'Shopping & Achats': 'ShoppingBag',
  Éducation: 'GraduationCap',
  'Autre Dépense': 'CreditCard',
};
