import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Moon, Sun, Trash2, Menu, X } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { cn } from './UI';
import { motion, AnimatePresence } from 'motion/react';

export function MobileSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { theme, toggleTheme, resetMonth } = useFinance();

  const navItems = [
    { path: '/', label: 'Visão Mensal', icon: LayoutDashboard },
    { path: '/weekly', label: 'Controle Semanal', icon: CalendarDays },
  ];

  const handleReset = () => {
    if (confirm('Tem certeza que deseja zerar todos os lançamentos do mês?')) {
      resetMonth();
      setIsOpen(false);
    }
  };

  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
            />

            {/* Sidebar Content */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 z-[80] flex flex-col transition-colors duration-300"
            >
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    FinancePro
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Controle de Finanças</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                      isActive 
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 font-semibold" 
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                    )}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={20} />
                  Resetar Mês
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
