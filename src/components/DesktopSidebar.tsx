import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Moon, Sun, Trash2 } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { cn } from './UI';

export function DesktopSidebar() {
  const { theme, toggleTheme, resetMonth } = useFinance();

  const navItems = [
    { path: '/', label: 'Visão Mensal', icon: LayoutDashboard },
    { path: '/weekly', label: 'Controle Semanal', icon: CalendarDays },
  ];

  const handleReset = () => {
    if (confirm('Tem certeza que deseja zerar todos os lançamentos do mês?')) {
      resetMonth();
    }
  };

  return (
    <div className="hidden lg:flex fixed top-16 left-0 h-[calc(100vh-64px)] w-64 flex-col bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 z-50 transition-colors duration-300">
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

      {/* Footer Actions */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <Trash2 size={20} />
          Resetar Mês
        </button>
      </div>
    </div>
  );
}
