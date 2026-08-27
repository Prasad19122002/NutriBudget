import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CookingPot,
  Calendar,
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { FoodItem } from '../../types';

export const DashboardTab: React.FC = () => {
  const {
    settings,
    monthlySpent,
    remainingBudget,
    percentBudgetUsed,
    todayProtein,
    todayMealsCompletedCount,
    todayMeals,
    toggleMealCompleted,
    budgetStatus,
    recommendedDailyBudgetRemaining,
    foodDatabase,
    addFoodLog,
    setIsQuickAddOpen,
    setIsLogWeightOpen,
    setIsAddExpenseOpen,
    setActiveTab,
  } = useApp();

  const proteinGoalMet = todayProtein >= settings.dailyProteinTarget;
  const proteinPercent = Math.min(100, Math.round((todayProtein / settings.dailyProteinTarget) * 100));

  // Quick staple foods for instant 1-tap logging
  const quickStapleIds = ['egg', 'soy_chunks', 'chicken', 'paneer', 'chana', 'green_gram', 'milk', 'curd', 'banana'];
  const stapleFoods = foodDatabase.filter((f) => quickStapleIds.includes(f.id));

  const handleQuickAddFood = (food: FoodItem) => {
    addFoodLog(food.id, 1, 'snack');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="dashboard-tab-content">
      
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Monthly Budget Card */}
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-200 transition-all cursor-pointer group"
          onClick={() => setActiveTab('budget')}
          id="card-kpi-budget"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Monthly Budget
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(settings.monthlyBudget)}
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Spent: <strong className="text-slate-900">{formatCurrency(monthlySpent)}</strong></span>
              <span>Rem: <strong className={remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}>{formatCurrency(remainingBudget)}</strong></span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  budgetStatus === 'exceeded'
                    ? 'bg-red-500'
                    : budgetStatus === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                )}
                style={{ width: `${percentBudgetUsed}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Today's Protein Card */}
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-emerald-200 transition-all cursor-pointer group"
          onClick={() => setActiveTab('progress')}
          id="card-kpi-protein"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Protein
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
            <span>{Math.round(todayProtein)}</span>
            <span className="text-sm font-semibold text-slate-400">/ {settings.dailyProteinTarget} g</span>
          </div>

          <div className="mt-2 space-y-1.5">
            {proteinGoalMet ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎯 Protein goal reached!</span>
              </div>
            ) : (
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>{proteinPercent}% done</span>
                <span>{Math.max(0, Math.round(settings.dailyProteinTarget - todayProtein))}g left</span>
              </div>
            )}

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Today's Meals Card */}
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-200 transition-all cursor-pointer group"
          onClick={() => setActiveTab('meals')}
          id="card-kpi-meals"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Meals
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
            <span>{todayMealsCompletedCount}</span>
            <span className="text-sm font-semibold text-slate-400">/ 3 completed</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            {['breakfast', 'lunch', 'dinner'].map((m) => {
              const isDone = todayMeals[m as 'breakfast' | 'lunch' | 'dinner'].completed;
              return (
                <div
                  key={m}
                  className={cn(
                    'flex-1 h-2 rounded-full transition-colors',
                    isDone ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* 4. Current Weight Card */}
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-purple-200 transition-all cursor-pointer group"
          onClick={() => setIsLogWeightOpen(true)}
          id="card-kpi-weight"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Weight
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Scale className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
            <span>{settings.currentWeight}</span>
            <span className="text-sm font-semibold text-slate-400">kg</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-700">
              Start: {settings.startingWeight} kg
            </span>
            <span className="font-bold text-blue-600 hover:underline">
              + Update
            </span>
          </div>
        </div>

      </div>

      {/* Budget Status Alert Bar */}
      <div
        className={cn(
          'p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all shadow-xs',
          budgetStatus === 'on_track'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : budgetStatus === 'warning'
            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
            : 'bg-red-50/80 border-red-200 text-red-900'
        )}
        id="budget-status-alert"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full animate-ping" />
          <div>
            <span className="text-sm font-bold block">
              {budgetStatus === 'on_track' && "🟢 You're on track with your ₹4,500 monthly budget!"}
              {budgetStatus === 'warning' && "🟠 You're spending faster than planned for this month"}
              {budgetStatus === 'exceeded' && `🔴 Monthly budget exceeded by ${formatCurrency(Math.abs(remainingBudget))}`}
            </span>
            <span className="text-xs opacity-80">
              Recommended daily allowance for remaining days: <strong>{formatCurrency(recommendedDailyBudgetRemaining)}/day</strong>
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('budget')}
          className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-800 hover:bg-slate-50 transition-all flex items-center gap-1"
        >
          <span>View Budget Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Today's Meals Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Today's Planned Meals
            </h2>
            <p className="text-xs text-slate-500">Tap completion to log protein & estimated food cost</p>
          </div>
          <button
            onClick={() => setActiveTab('meals')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Customize Meals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Breakfast Card */}
          <div
            className={cn(
              'rounded-2xl p-4 border transition-all flex flex-col justify-between',
              todayMeals.breakfast.completed
                ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            )}
            id="dashboard-meal-breakfast"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                  <span>☀️</span> Breakfast
                </span>
                <span className="text-xs font-semibold text-slate-500">08:00 AM</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                2 Eggs + 50g Muesli + Milk + Banana
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2">
                2 eggs (~12.6g), 50g muesli (~5g), 250ml milk (~8g), 1 banana (~1.2g)
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-emerald-700 block">~{todayMeals.breakfast.totalProtein}g protein</span>
                <span className="text-slate-500 font-medium">Cost: ~{formatCurrency(todayMeals.breakfast.totalCost)}</span>
              </div>

              <button
                onClick={() => toggleMealCompleted('breakfast')}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs',
                  todayMeals.breakfast.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
                id="btn-toggle-breakfast"
              >
                {todayMeals.breakfast.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Done</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>Mark as Done</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lunch Card */}
          <div
            className={cn(
              'rounded-2xl p-4 border transition-all flex flex-col justify-between',
              todayMeals.lunch.completed
                ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            )}
            id="dashboard-meal-lunch"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                  <span>🍱</span> Lunch
                </span>
                <span className="text-xs font-semibold text-slate-500">01:30 PM</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Rice + {todayMeals.lunch.proteinSource || 'Soy chunks'} + Chana + Curd
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2">
                100g Rice, 50g Soy (~26g), 50g Chana (~10g), Vegetables, 250g Curd (~8.5g)
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-emerald-700 block">~{todayMeals.lunch.totalProtein}g protein</span>
                <span className="text-slate-500 font-medium">Cost: ~{formatCurrency(todayMeals.lunch.totalCost)}</span>
              </div>

              <button
                onClick={() => toggleMealCompleted('lunch')}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs',
                  todayMeals.lunch.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
                id="btn-toggle-lunch"
              >
                {todayMeals.lunch.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Done</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>Mark as Done</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dinner Card */}
          <div
            className={cn(
              'rounded-2xl p-4 border transition-all flex flex-col justify-between',
              todayMeals.dinner.completed
                ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
            )}
            id="dashboard-meal-dinner"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 flex items-center gap-1">
                  <span>🌙</span> Dinner (Cook Once)
                </span>
                <span className="text-xs font-semibold text-slate-500">08:30 PM</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Same Curry + Rice / Chapathi + 2 Eggs
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2">
                Reheated lunch batch curry, Rice or 2 Chapathis, 2 Boiled/Fried Eggs (~12.6g)
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-emerald-700 block">~{todayMeals.dinner.totalProtein}g protein</span>
                <span className="text-slate-500 font-medium">Cost: ~{formatCurrency(todayMeals.dinner.totalCost)}</span>
              </div>

              <button
                onClick={() => toggleMealCompleted('dinner')}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs',
                  todayMeals.dinner.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
                id="btn-toggle-dinner"
              >
                {todayMeals.dinner.completed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Done</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5" />
                    <span>Mark as Done</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Add Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Quick Add Staple Foods (1-Tap Log)
            </h3>
            <p className="text-xs text-slate-500">Instantly logs 1 standard serving to today's protein count</p>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            More Foods & Custom Quantity →
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {stapleFoods.map((food) => (
            <button
              key={food.id}
              onClick={() => handleQuickAddFood(food)}
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-800 transition-all active:scale-95 group"
            >
              <span className="text-base">{food.icon || '🍽️'}</span>
              <div className="text-left">
                <span className="block font-bold text-slate-900">{food.name}</span>
                <span className="text-[11px] text-emerald-600 font-bold">+{food.protein}g</span>
              </div>
              <Plus className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
            </button>
          ))}
        </div>
      </div>

      {/* Work-Friendly "Cook Once" Highlight Card */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold border border-blue-700">
            <CookingPot className="w-3.5 h-3.5" />
            <span>Work-Friendly Cooking Strategy</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">Cook Once → Lunch + Dinner</h3>
          <p className="text-xs sm:text-sm text-blue-100">
            Prep a batch curry (Soy + Chana / Chicken / Paneer) in the morning or previous night. Divide into lunch tiffin and fridge portion for dinner to save cooking time while working.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('plan')}
          className="px-4 py-2 rounded-xl bg-white text-blue-950 font-bold text-xs hover:bg-blue-50 active:scale-95 transition-all shrink-0 shadow-xs"
        >
          View Batch Recipes & Plan
        </button>
      </div>

    </div>
  );
};
