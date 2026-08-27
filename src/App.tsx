import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { MealsTab } from './components/meals/MealsTab';
import { BudgetTab } from './components/budget/BudgetTab';
import { PlanTab } from './components/plan/PlanTab';
import { ProgressTab } from './components/progress/ProgressTab';
import { QuickAddModal } from './components/common/QuickAddModal';
import { AddExpenseModal } from './components/common/AddExpenseModal';
import { LogWeightModal } from './components/common/LogWeightModal';
import { SettingsModal } from './components/settings/SettingsModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* App Header */}
      <Header />

      {/* Navigation Bars (Desktop bar + Mobile bottom nav) */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-12">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'meals' && <MealsTab />}
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'progress' && <ProgressTab />}
      </main>

      {/* Modals & Dialogs */}
      <QuickAddModal />
      <AddExpenseModal />
      <LogWeightModal />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
