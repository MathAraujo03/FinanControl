import React, { useState } from 'react';
import { useFinance } from '../hooks/useFinance';
import { Card, Button, Input, Select, cn } from '../components/UI';
import { Modal } from '../components/Modal';
import { CARD_NAMES, CARD_COLORS, MONTHLY_CHART_COLORS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { Plus, Wallet, TrendingUp, TrendingDown, CreditCard, PiggyBank, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CardName } from '../types';

export function MonthlyView() {
  const { 
    incomes, investments, expenses, cardExpenses, 
    addIncome, updateIncome, removeIncome,
    addInvestment, updateInvestment, removeInvestment,
    addExpense, updateExpense, removeExpense,
    addCardExpense, updateCardExpense, removeCardExpense 
  } = useFinance();

  // Form states
  const [incomeForm, setIncomeForm] = useState({ source: '', value: '', date: new Date().toISOString().split('T')[0] });
  const [investForm, setInvestForm] = useState({ destination: '', value: '', date: new Date().toISOString().split('T')[0] });
  const [expenseForm, setExpenseForm] = useState({ source: '', value: '', date: new Date().toISOString().split('T')[0], category: '' });
  const [cardForm, setCardForm] = useState({ 
    card: CARD_NAMES[0], description: '', value: '', date: new Date().toISOString().split('T')[0], 
    isInstallment: false, installmentsCount: 1 
  });

  // Edit states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Totals
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.value, 0);
  const totalInvestments = investments.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const totalCards = cardExpenses.reduce((acc, curr) => acc + curr.value, 0);
  const remaining = totalIncome - (totalInvestments + totalExpenses + totalCards);

  // Chart Data
  const monthlyData = [
    { name: 'Investimentos', value: totalInvestments, color: MONTHLY_CHART_COLORS.investments },
    { name: 'Despesas', value: totalExpenses + totalCards, color: MONTHLY_CHART_COLORS.expenses },
    { name: 'Restante', value: Math.max(0, remaining), color: MONTHLY_CHART_COLORS.remaining },
  ];

  const cardData = CARD_NAMES.map(card => ({
    name: card,
    value: cardExpenses.find(e => e.card === card)?.value || 0,
    color: CARD_COLORS[card]
  })).filter(d => d.value > 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleRemove = (item: any) => {
    if (confirm('Tem certeza que deseja remover este lançamento?')) {
      if (item.source && !item.category) removeIncome(item.id);
      else if (item.destination) removeInvestment(item.id);
      else if (item.card) removeCardExpense(item.id);
      else removeExpense(item.id);
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const { id, ...data } = editingItem;
    if (editingItem.source && !editingItem.category) updateIncome(id, data);
    else if (editingItem.destination) updateInvestment(id, data);
    else if (editingItem.card) updateCardExpense(id, data);
    else updateExpense(id, data);
    
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Visão Mensal</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Resumo financeiro e lançamentos do mês</p>
        </div>
        <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none">
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Saldo Restante</p>
            <p className={`text-2xl font-black ${remaining >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${remaining >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-500/10 text-rose-600 dark:text-rose-500'}`}>
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Receitas" value={totalIncome} icon={TrendingUp} color="text-amber-500" bgColor="bg-amber-500/10" />
        <SummaryCard title="Investimentos" value={totalInvestments} icon={PiggyBank} color="text-blue-500" bgColor="bg-blue-500/10" />
        <SummaryCard title="Despesas" value={totalExpenses} icon={TrendingDown} color="text-red-500" bgColor="bg-red-500/10" />
        <SummaryCard title="Cartões" value={totalCards} icon={CreditCard} color="text-orange-500" bgColor="bg-orange-500/10" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Gráfico Mensal Geral</h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {monthlyData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
        </Card>

        <Card className="min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Gastos por Cartão</h3>
          <div className="flex-1 w-full min-h-[300px]">
            {cardData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cardData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                Nenhum gasto no cartão lançado
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Income Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <TrendingUp size={20} />
            <h4 className="font-bold uppercase text-xs tracking-widest">Nova Receita</h4>
          </div>
          <Input label="Fonte" placeholder="Ex: Salário" value={incomeForm.source} onChange={e => setIncomeForm({...incomeForm, source: e.target.value})} />
          <Input label="Valor" type="number" placeholder="0,00" value={incomeForm.value} onChange={e => setIncomeForm({...incomeForm, value: e.target.value})} />
          <Input label="Data" type="date" value={incomeForm.date} onChange={e => setIncomeForm({...incomeForm, date: e.target.value})} />
          <Button className="w-full" onClick={() => {
            if (!incomeForm.source || !incomeForm.value) return;
            addIncome({ source: incomeForm.source, value: Number(incomeForm.value), date: incomeForm.date });
            setIncomeForm({ source: '', value: '', date: new Date().toISOString().split('T')[0] });
          }}>
            <Plus size={18} /> Adicionar
          </Button>
        </Card>

        {/* Investment Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <PiggyBank size={20} />
            <h4 className="font-bold uppercase text-xs tracking-widest">Novo Investimento</h4>
          </div>
          <Input label="Destino" placeholder="Ex: CDB Itaú" value={investForm.destination} onChange={e => setInvestForm({...investForm, destination: e.target.value})} />
          <Input label="Valor" type="number" placeholder="0,00" value={investForm.value} onChange={e => setInvestForm({...investForm, value: e.target.value})} />
          <Input label="Data" type="date" value={investForm.date} onChange={e => setInvestForm({...investForm, date: e.target.value})} />
          <Button className="w-full" variant="secondary" onClick={() => {
            if (!investForm.destination || !investForm.value) return;
            addInvestment({ destination: investForm.destination, value: Number(investForm.value), date: investForm.date });
            setInvestForm({ destination: '', value: '', date: new Date().toISOString().split('T')[0] });
          }}>
            <Plus size={18} /> Adicionar
          </Button>
        </Card>

        {/* Expense Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <TrendingDown size={20} />
            <h4 className="font-bold uppercase text-xs tracking-widest">Nova Despesa</h4>
          </div>
          <Input label="Fonte" placeholder="Ex: Aluguel" value={expenseForm.source} onChange={e => setExpenseForm({...expenseForm, source: e.target.value})} />
          <Input label="Valor" type="number" placeholder="0,00" value={expenseForm.value} onChange={e => setExpenseForm({...expenseForm, value: e.target.value})} />
          <Input label="Data" type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} />
          <Input label="Categoria (Opcional)" placeholder="Ex: Moradia" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} />
          <Button className="w-full" variant="danger" onClick={() => {
            if (!expenseForm.source || !expenseForm.value) return;
            addExpense({ source: expenseForm.source, value: Number(expenseForm.value), date: expenseForm.date, category: expenseForm.category });
            setExpenseForm({ source: '', value: '', date: new Date().toISOString().split('T')[0], category: '' });
          }}>
            <Plus size={18} /> Adicionar
          </Button>
        </Card>

        {/* Card Expense Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <CreditCard size={20} />
            <h4 className="font-bold uppercase text-xs tracking-widest">Total Mensal Cartão</h4>
          </div>
          <Select 
            label="Cartão" 
            options={CARD_NAMES.map(c => ({ value: c, label: c }))} 
            value={cardForm.card} 
            onChange={e => setCardForm({...cardForm, card: e.target.value as CardName})} 
          />
          <Input label="Valor Total no Mês" type="number" placeholder="0,00" value={cardForm.value} onChange={e => setCardForm({...cardForm, value: e.target.value})} />
          
          <div className="pt-2">
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              * O valor informado substituirá qualquer lançamento anterior para este mesmo cartão no mês atual.
            </p>
          </div>

          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={() => {
            if (!cardForm.value) return;
            addCardExpense({ 
              card: cardForm.card, 
              description: `Total Mensal - ${cardForm.card}`, 
              value: Number(cardForm.value), 
              date: new Date().toISOString().split('T')[0],
              isInstallment: false,
            });
            setCardForm({ ...cardForm, value: '' });
          }}>
            <Plus size={18} /> Salvar Total
          </Button>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="overflow-hidden">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Listagem de Lançamentos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 text-xs uppercase tracking-widest">
                <th className="px-4 py-3 font-bold">Data</th>
                <th className="px-4 py-3 font-bold">Tipo</th>
                <th className="px-4 py-3 font-bold">Descrição/Fonte</th>
                <th className="px-4 py-3 font-bold">Valor</th>
                <th className="px-4 py-3 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {[...incomes, ...investments, ...expenses, ...cardExpenses]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item: any) => (
                  <tr key={item.id} className="text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                    <td className="px-4 py-4">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        item.source && !item.category ? "bg-amber-500/10 text-amber-600 dark:text-amber-500" :
                        item.destination ? "bg-blue-500/10 text-blue-600 dark:text-blue-500" :
                        item.card ? "bg-orange-500/10 text-orange-600 dark:text-orange-500" :
                        "bg-red-500/10 text-red-600 dark:text-red-500"
                      )}>
                        {item.source && !item.category ? 'Receita' :
                         item.destination ? 'Investimento' :
                         item.card ? `Cartão (${item.card})` :
                         'Despesa'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium">{item.source || item.destination || item.description}</td>
                    <td className={cn(
                      "px-4 py-4 font-bold",
                      item.source && !item.category ? "text-emerald-600 dark:text-emerald-500" : "text-zinc-900 dark:text-zinc-300"
                    )}>
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleRemove(item)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {([...incomes, ...investments, ...expenses, ...cardExpenses]).length === 0 && (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
              Nenhum lançamento encontrado para este mês.
            </div>
          )}
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Editar Lançamento"
      >
        {editingItem && (
          <div className="space-y-4">
            {editingItem.source !== undefined && (
              <Input 
                label={editingItem.category ? "Fonte" : "Fonte"} 
                value={editingItem.source} 
                onChange={e => setEditingItem({...editingItem, source: e.target.value})} 
              />
            )}
            {editingItem.destination !== undefined && (
              <Input 
                label="Destino" 
                value={editingItem.destination} 
                onChange={e => setEditingItem({...editingItem, destination: e.target.value})} 
              />
            )}
            {editingItem.description !== undefined && (
              <Input 
                label="Descrição" 
                value={editingItem.description} 
                onChange={e => setEditingItem({...editingItem, description: e.target.value})} 
              />
            )}
            {editingItem.card !== undefined && (
              <Select 
                label="Cartão" 
                options={CARD_NAMES.map(c => ({ value: c, label: c }))} 
                value={editingItem.card} 
                onChange={e => setEditingItem({...editingItem, card: e.target.value as CardName})} 
              />
            )}
            <Input 
              label="Valor" 
              type="number" 
              value={editingItem.value} 
              onChange={e => setEditingItem({...editingItem, value: Number(e.target.value)})} 
            />
            <Input 
              label="Data" 
              type="date" 
              value={editingItem.date} 
              onChange={e => setEditingItem({...editingItem, date: e.target.value})} 
            />
            {editingItem.category !== undefined && (
              <Input 
                label="Categoria" 
                value={editingItem.category} 
                onChange={e => setEditingItem({...editingItem, category: e.target.value})} 
              />
            )}
            
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

function SummaryCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={cn("p-3 rounded-xl", bgColor, color)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{title}</p>
        <p className="text-xl font-bold text-zinc-900 dark:text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </p>
      </div>
    </Card>
  );
}
