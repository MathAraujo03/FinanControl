import React from 'react';
import { Wallet, Menu, Sun, Moon } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useFinance();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-[60] transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="p-2 bg-amber-500 rounded-lg text-black hidden sm:block">
          <Wallet size={24} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white leading-none">
            FinancePro
          </h1>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mt-0.5">
            Controle de Finanças Pessoais
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-500 transition-all duration-300 shadow-sm"
          aria-label="Alternar Tema"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="hidden md:flex flex-col items-end mr-2">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Matheus AJ</p>
          <p className="text-[10px] text-zinc-500">Premium Plan</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-sm font-bold text-amber-500 shadow-sm dark:shadow-lg">
          MA
        </div>
      </div>
    </header>
  );
}
