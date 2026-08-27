import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Wallet,
  CalendarDays,
  LineChart,
  Plus,
  Egg,
  Receipt,
  Scale,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsQuickAddOpen,
    setIsAddExpenseOpen,
    setIsLogWeightOpen,
    todayMealsCompletedCount,
    todayProtein,
    settings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'meals',
      label: 'Meals',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      badge: `${todayMealsCompletedCount}/3`,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      id: 'plan',
      label: 'Plan',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <LineChart className="w-5 h-5" />,
      badge: `${Math.round(todayProtein)}g`,
    },
  ];

  return (
    <>
      {/* Desktop Horizontal / Sidebar Navigation */}
      <nav
        className="hidden md:flex bg-white border-b border-slate-200 sticky top-[69px] z-20"
        aria-label="Desktop Tabs"
        id="desktop-nav-bar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <div className="flex space-x-1 sm:space-x-2 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  id={`nav-tab-${tab.id}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full font-bold',
                        isActive
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Target: {settings.dailyProteinTarget}g Protein
            </span>
          </div>
        </div>
      </nav>

      {/* Floating Action Menu Button (Mobile & Desktop quick access) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        {mobileMenuOpen && (
          <div className="mb-3 flex flex-col gap-2 items-end animate-in fade-in slide-in-from-bottom-3 duration-150">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsLogWeightOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-slate-800 text-xs font-bold shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
              id="fab-log-weight"
            >
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Log Weight</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAddExpenseOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-slate-800 text-xs font-bold shadow-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
              id="fab-add-expense"
            >
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Add Expense</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsQuickAddOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              id="fab-add-food"
            >
              <Egg className="w-4 h-4" />
              <span>Quick Add Food</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Quick Action Menu"
          id="btn-floating-action"
          className={cn(
            'w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90',
            mobileMenuOpen ? 'bg-slate-800 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-2 py-1.5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
        id="mobile-bottom-nav"
      >
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`mobile-nav-${tab.id}`}
                className={cn(
                  'flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative',
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 font-medium hover:text-slate-900'
                )}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-0.5">{tab.label}</span>
                {isActive && (
                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
