import { CardName } from '../types';

export const CARD_COLORS: Record<CardName, string> = {
  'Azul MC Platinum': '#003366', // Azul Escuro
  'Itaú Visa Platinum': '#FF6321', // Laranja
  'Nubank': '#8A05BE', // Roxo
  'Bradesco Visa Platinum': '#4B4B4B', // Cinza Escuro
  'Carrefour': '#00AEEF', // Azul Claro
  'Porto Bank': '#0055A4', // Azul Escuro (levemente mais claro que o Azul MC)
};

export const MONTHLY_CHART_COLORS = {
  incomes: '#FBBF24', // Amarelo
  investments: '#3B82F6', // Azul
  expenses: '#EF4444', // Vermelho
  cards: '#F97316', // Laranja
  remaining: '#22C55E', // Verde
};

export const CARD_NAMES: CardName[] = [
  'Azul MC Platinum',
  'Itaú Visa Platinum',
  'Nubank',
  'Bradesco Visa Platinum',
  'Carrefour',
  'Porto Bank',
];
