import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card, Button, Input, Select, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { 
  PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { Plus, AlertCircle, CheckCircle2, Calendar, CreditCard, Banknote, QrCode, CreditCard as DebitIcon, Pencil, Trash2 } from 'lucide-react';
import { PaymentMethod } from '../types';

export function WeeklyControl() {
  const { 
    incomes, investments, expenses, cardExpenses, 
    weeklyExpenses, weeksCount, setWeeksCount, addWeeklyExpense, updateWeeklyExpense, removeWeeklyExpense 
  } = useFinance();

  const [form, setForm] = useState({ description: '', value: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Cartão de crédito' as PaymentMethod, weekIndex: 0 });

  // Edit states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Totals from monthly view
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.value, 0);
  const totalInvestments = investments.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const totalCards = cardExpenses.reduce((acc, curr) => acc + curr.value, 0);
  const monthlyRemaining = totalIncome - (totalInvestments + totalExpenses + totalCards);

  // Weekly budget
  const weeklyBudget = monthlyRemaining / weeksCount;

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const paymentMethods: { value: PaymentMethod; label: string; icon: any; color: string }[] = [
    { value: 'Cartão de crédito', label: 'Cartão de Crédito', icon: CreditCard, color: 'text-orange-500' },
    { value: 'Débito', label: 'Débito', icon: DebitIcon, color: 'text-blue-500' },
    { value: 'Pix', label: 'Pix', icon: QrCode, color: 'text-emerald-500' },
    { value: 'Dinheiro', label: 'Dinheiro', icon: Banknote, color: 'text-green-500' },
  ];

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleRemove = (id: string) => {
    if (confirm('Tem certeza que deseja remover este lançamento?')) {
      removeWeeklyExpense(id);
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const { id, ...data } = editingItem;
    updateWeeklyExpense(id, data);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Controle Semanal</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Gerencie seus gastos semanais com base no saldo restante</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
          <button 
            onClick={() => setWeeksCount(4)}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", weeksCount === 4 ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white")}
          >
            4 Semanas
          </button>
          <button 
            onClick={() => setWeeksCount(5)}
            className={cn("px-4 py-2 rounded-lg text-sm font-bold transition-all", weeksCount === 5 ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white")}
          >
            5 Semanas
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-sm text-zinc-500 uppercase font-bold tracking-widest">Orçamento Semanal Disponível</p>
            <p className="text-4xl font-black text-amber-600 dark:text-amber-500">{formatCurrency(weeklyBudget)}</p>
            <p className="text-xs text-zinc-500">Calculado sobre {formatCurrency(monthlyRemaining)} / {weeksCount} semanas</p>
          </div>
          
          <div className="h-px md:h-12 w-full md:w-px bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex-1 w-full space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 text-center md:text-left">Novo Gasto Semanal</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              <Input placeholder="Descrição" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <Input placeholder="Valor" type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
              <Select 
                options={[...Array(weeksCount)].map((_, i) => ({ value: String(i), label: `Semana ${i + 1}` }))} 
                value={String(form.weekIndex)} 
                onChange={e => setForm({...form, weekIndex: Number(e.target.value)})} 
              />
              <Select 
                options={paymentMethods.map(p => ({ value: p.value, label: p.label }))} 
                value={form.paymentMethod} 
                onChange={e => setForm({...form, paymentMethod: e.target.value as PaymentMethod})} 
              />
              <Button className="w-full" onClick={() => {
                if (!form.description || !form.value) return;
                addWeeklyExpense({ 
                  description: form.description, 
                  value: Number(form.value), 
                  date: form.date, 
                  paymentMethod: form.paymentMethod, 
                  weekIndex: form.weekIndex 
                });
                setForm({ ...form, description: '', value: '' });
              }}>
                <Plus size={18} /> Lançar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(weeksCount)].map((_, index) => {
          const weekExpenses = weeklyExpenses.filter(e => e.weekIndex === index);
          const totalSpent = weekExpenses.reduce((acc, curr) => acc + curr.value, 0);
          const remaining = weeklyBudget - totalSpent;
          
          const weeklyGoal = weeklyBudget * 0.1;
          const isGoalMet = remaining >= weeklyGoal;

          const chartData = [
            { name: 'Total Gasto', value: totalSpent, color: '#EF4444' },
            { name: 'Saldo/Economia', value: Math.max(0, remaining), color: '#22C55E' },
          ];

          return (
            <Card key={index} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Semana {index + 1}</h3>
                </div>
                {isGoalMet ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={14} /> Meta Atingida
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium">Mínimo: {formatCurrency(weeklyGoal)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 text-xs font-bold bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                      <AlertCircle size={14} /> Meta Não Atingida
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium">Mínimo: {formatCurrency(weeklyGoal)}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                  <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Gasto</p>
                  <p className="text-xs font-bold text-red-500">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="text-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                  <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Sobra</p>
                  <p className={cn("text-xs font-bold", remaining >= 0 ? "text-green-500" : "text-red-500")}>
                    {formatCurrency(remaining)}
                  </p>
                </div>
                <div className="text-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                  <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Economia</p>
                  <p className={cn("text-xs font-bold", remaining > 0 ? "text-blue-500" : "text-zinc-500")}>
                    {formatCurrency(Math.max(0, remaining))}
                  </p>
                </div>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.filter(d => d.value > 0).map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', border: '1px solid var(--tooltip-border, #e5e7eb)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--tooltip-text, #111827)' }}
                  formatter={(val: number) => formatCurrency(val)}
                />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {isGoalMet ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Parabéns!</p>
                    <p className="text-xs text-emerald-800 dark:text-emerald-200/80 leading-relaxed">
                      Você economizou {formatCurrency(remaining)}, superando a meta de {formatCurrency(weeklyGoal)} (10%).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <AlertCircle size={20} className="text-rose-600 dark:text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-rose-700 dark:text-rose-400">Atenção!</p>
                    <p className="text-xs text-rose-800 dark:text-rose-200/80 leading-relaxed">
                      Sua economia foi de {formatCurrency(Math.max(0, remaining))}, abaixo da meta de {formatCurrency(weeklyGoal)} (10%).
                    </p>
                  </div>
                </div>
              )}

              {/* Weekly Transactions */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Lançamentos da Semana</h4>
                <div className="space-y-2">
                  {weekExpenses.map(expense => {
                    const method = paymentMethods.find(p => p.value === expense.paymentMethod);
                    return (
                      <div key={expense.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-zinc-100 dark:border-zinc-800/30 hover:border-amber-500/30 transition-all gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm", method?.color)}>
                            {method && <method.icon size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{expense.description}</p>
                            <p className="text-[10px] text-zinc-500">{expense.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 dark:border-zinc-800/50">
                          <p className="text-sm font-black text-zinc-900 dark:text-white">{formatCurrency(expense.value)}</p>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleEdit(expense)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all opacity-80 hover:opacity-100 hover:scale-110"
                              title="Editar"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleRemove(expense.id)}
                              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-80 hover:opacity-100 hover:scale-110"
                              title="Remover"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {weekExpenses.length === 0 && (
                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 py-4">Nenhum gasto lançado para esta semana.</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Editar Gasto Semanal"
      >
        {editingItem && (
          <div className="space-y-4">
            <Input 
              label="Descrição" 
              value={editingItem.description} 
              onChange={e => setEditingItem({...editingItem, description: e.target.value})} 
            />
            <Input 
              label="Valor" 
              type="number" 
              value={editingItem.value} 
              onChange={e => setEditingItem({...editingItem, value: Number(e.target.value)})} 
            />
            <Select 
              label="Semana" 
              options={[...Array(weeksCount)].map((_, i) => ({ value: String(i), label: `Semana ${i + 1}` }))} 
              value={String(editingItem.weekIndex)} 
              onChange={e => setEditingItem({...editingItem, weekIndex: Number(e.target.value)})} 
            />
            <Select 
              label="Método de Pagamento" 
              options={paymentMethods.map(p => ({ value: p.value, label: p.label }))} 
              value={editingItem.paymentMethod} 
              onChange={e => setEditingItem({...editingItem, paymentMethod: e.target.value as PaymentMethod})} 
            />
            
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleSaveEdit}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
