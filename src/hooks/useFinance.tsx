import React, { createContext, useContext, useEffect, useState } from 'react';
import { FinanceState, Income, Investment, Expense, CardExpense, WeeklyExpense, CardName, PaymentMethod } from '../types';

interface FinanceContextType extends FinanceState {
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  removeIncome: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  removeInvestment: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  addCardExpense: (cardExpense: Omit<CardExpense, 'id'>) => void;
  updateCardExpense: (id: string, cardExpense: Partial<CardExpense>) => void;
  removeCardExpense: (id: string) => void;
  addWeeklyExpense: (weeklyExpense: Omit<WeeklyExpense, 'id'>) => void;
  updateWeeklyExpense: (id: string, weeklyExpense: Partial<WeeklyExpense>) => void;
  removeWeeklyExpense: (id: string) => void;
  setWeeksCount: (count: 4 | 5) => void;
  toggleTheme: () => void;
  resetMonth: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const initialState: FinanceState = {
  incomes: [],
  investments: [],
  expenses: [],
  cardExpenses: [],
  weeklyExpenses: [],
  weeksCount: 4,
  theme: 'dark',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinanceState>(() => {
    const saved = localStorage.getItem('finansaas_state');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('finansaas_state', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const addIncome = (income: Omit<Income, 'id'>) => {
    setState(prev => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: crypto.randomUUID() }]
    }));
  };

  const updateIncome = (id: string, income: Partial<Income>) => {
    setState(prev => ({
      ...prev,
      incomes: prev.incomes.map(i => i.id === id ? { ...i, ...income } : i)
    }));
  };

  const removeIncome = (id: string) => {
    setState(prev => ({
      ...prev,
      incomes: prev.incomes.filter(i => i.id !== id)
    }));
  };

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    setState(prev => ({
      ...prev,
      investments: [...prev.investments, { ...investment, id: crypto.randomUUID() }]
    }));
  };

  const updateInvestment = (id: string, investment: Partial<Investment>) => {
    setState(prev => ({
      ...prev,
      investments: prev.investments.map(i => i.id === id ? { ...i, ...investment } : i)
    }));
  };

  const removeInvestment = (id: string) => {
    setState(prev => ({
      ...prev,
      investments: prev.investments.filter(i => i.id !== id)
    }));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: crypto.randomUUID() }]
    }));
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...expense } : e)
    }));
  };

  const removeExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const addCardExpense = (cardExpense: Omit<CardExpense, 'id'>) => {
    setState(prev => {
      const existingIndex = prev.cardExpenses.findIndex(e => e.card === cardExpense.card);
      const newCardExpenses = [...prev.cardExpenses];
      
      if (existingIndex >= 0) {
        newCardExpenses[existingIndex] = { ...cardExpense, id: prev.cardExpenses[existingIndex].id };
      } else {
        newCardExpenses.push({ ...cardExpense, id: crypto.randomUUID() });
      }

      return {
        ...prev,
        cardExpenses: newCardExpenses
      };
    });
  };

  const updateCardExpense = (id: string, cardExpense: Partial<CardExpense>) => {
    setState(prev => ({
      ...prev,
      cardExpenses: prev.cardExpenses.map(e => e.id === id ? { ...e, ...cardExpense } : e)
    }));
  };

  const removeCardExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      cardExpenses: prev.cardExpenses.filter(e => e.id !== id)
    }));
  };

  const addWeeklyExpense = (weeklyExpense: Omit<WeeklyExpense, 'id'>) => {
    setState(prev => ({
      ...prev,
      weeklyExpenses: [...prev.weeklyExpenses, { ...weeklyExpense, id: crypto.randomUUID() }]
    }));
  };

  const updateWeeklyExpense = (id: string, weeklyExpense: Partial<WeeklyExpense>) => {
    setState(prev => ({
      ...prev,
      weeklyExpenses: prev.weeklyExpenses.map(e => e.id === id ? { ...e, ...weeklyExpense } : e)
    }));
  };

  const removeWeeklyExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      weeklyExpenses: prev.weeklyExpenses.filter(e => e.id !== id)
    }));
  };

  const setWeeksCount = (count: 4 | 5) => {
    setState(prev => ({ ...prev, weeksCount: count }));
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const resetMonth = () => {
    setState(prev => ({
      ...initialState,
      theme: prev.theme, // Keep theme
    }));
  };

  return (
    <FinanceContext.Provider value={{ 
      ...state, 
      addIncome, updateIncome, removeIncome,
      addInvestment, updateInvestment, removeInvestment,
      addExpense, updateExpense, removeExpense,
      addCardExpense, updateCardExpense, removeCardExpense,
      addWeeklyExpense, updateWeeklyExpense, removeWeeklyExpense,
      setWeeksCount,
      toggleTheme,
      resetMonth
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
