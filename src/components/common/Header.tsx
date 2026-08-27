import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateDisplay, formatCurrency } from '../../lib/utils';
import { Calendar, Settings as SettingsIcon, Plus, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    settings,
    todayProtein,
    monthlySpent,
    remainingBudget,
    budgetStatus,
    setIsQuickAddOpen,
    setIsAddExpenseOpen,
    setIsSettingsOpen,
  } = useApp();

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    const newDateStr = d.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    const newMonth = newDateStr.slice(0, 7);
    if (newMonth !== selectedMonth) setSelectedMonth(newMonth);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const newDateStr = d.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    const newMonth = newDateStr.slice(0, 7);
    if (newMonth !== selectedMonth) setSelectedMonth(newMonth);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setSelectedMonth(today.slice(0, 7));
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs" id="main-app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Brand & Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                My Food Tracker
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {settings.userAge}y • {settings.currentWeight} kg
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {formatCurrency(settings.monthlyBudget)} Monthly Food & Protein Plan
            </p>
          </div>

          {/* Date Navigator & Quick Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            
            {/* Date Picker Bar */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700">
              <button
                onClick={handlePrevDay}
                className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-600 hover:text-slate-900"
                title="Previous Day"
                id="btn-prev-day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1 px-2 text-xs sm:text-sm font-semibold text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">{formatDateDisplay(selectedDate)}</span>
                <span className="sm:hidden">{selectedDate.slice(5)}</span>
              </div>

              <button
                onClick={handleNextDay}
                className="p-1 hover:bg-slate-200 rounded-md transition-colors text-slate-600 hover:text-slate-900"
                title="Next Day"
                id="btn-next-day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {!isToday && (
                <button
                  onClick={handleToday}
                  className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  id="btn-go-today"
                >
                  Today
                </button>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                id="header-btn-quick-add"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Food</span>
              </button>

              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
                id="header-btn-quick-expense"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Expense</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Settings & Food Database"
                id="header-btn-settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
