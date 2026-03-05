import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './hooks/useFinance';
import { DashboardLayout } from './components/DashboardLayout';
import { MonthlyView } from './pages/MonthlyView';
import { WeeklyControl } from './pages/WeeklyControl';

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<MonthlyView />} />
            <Route path="/weekly" element={<WeeklyControl />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}
