import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  ShoppingCart,
  Carrot,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CookingPot,
  Receipt,
  Check,
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';

export const PlanTab: React.FC = () => {
  const {
    weeklyPlan,
    shoppingList,
    toggleShoppingItem,
    convertShoppingItemToExpense,
    vegetables,
    toggleVegetablePurchased,
    weeklyVegetableSpendEstimate,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'weekly' | 'shopping' | 'vegetables'>('weekly');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const selectedDay = weeklyPlan[selectedDayIndex] || weeklyPlan[0];

  // Shopping list stats
  const totalEstimatedShopping = shoppingList.reduce((acc, curr) => acc + curr.estimatedPrice, 0);
  const checkedShoppingCount = shoppingList.filter((s) => s.checked).length;
  const purchasedVeggiesCount = vegetables.filter((v) => v.purchasedThisWeek).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="plan-tab-content">
      
      {/* Sub-navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('weekly')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0',
            activeSubTab === 'weekly'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          id="tab-btn-weekly-plan"
        >
          <CalendarDays className="w-4 h-4" />
          <span>7-Day Meal Plan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shopping')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0',
            activeSubTab === 'shopping'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          id="tab-btn-shopping-list"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Weekly Grocery List ({checkedShoppingCount}/{shoppingList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vegetables')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0',
            activeSubTab === 'vegetables'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          id="tab-btn-vegetables"
        >
          <Carrot className="w-4 h-4" />
          <span>Affordable Veg Tracker ({purchasedVeggiesCount})</span>
        </button>
      </div>

      {/* 1. WEEKLY MEAL PLAN SUBTAB */}
      {activeSubTab === 'weekly' && (
        <div className="space-y-5">
          {/* Day Selector Pill Bar */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weeklyPlan.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.dayName}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={cn(
                    'p-2.5 sm:p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1',
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  <span className="text-xs sm:text-sm font-bold">{day.dayShort}</span>
                  <span className={cn('text-[10px] font-semibold', isSelected ? 'text-blue-100' : 'text-emerald-700')}>
                    ~{Math.round(day.totalProtein)}g
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Overview */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  {selectedDay.dayName}'s Complete Meal Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-protein, affordable day plan designed for simple batch cooking.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Daily Protein</span>
                  <span className="text-base font-black text-emerald-700">~{selectedDay.totalProtein} g</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">Est. Cost</span>
                  <span className="text-base font-black text-blue-700">{formatCurrency(selectedDay.totalCost)}</span>
                </div>
              </div>
            </div>

            {/* 3 Meals for Selected Day */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Breakfast */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      ☀️ Breakfast
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ~{selectedDay.breakfast.estProtein}g Prot
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">
                    {selectedDay.breakfast.title}
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {selectedDay.breakfast.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 text-xs text-slate-500 font-semibold">
                  Est. Cost: {formatCurrency(selectedDay.breakfast.estCost)}
                </div>
              </div>

              {/* Lunch */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      🍱 Lunch
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ~{selectedDay.lunch.estProtein}g Prot
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {selectedDay.lunch.title}
                  </h4>
                  <div className="text-[11px] font-bold text-blue-700 mb-2">
                    Protein Focus: {selectedDay.lunch.proteinSource}
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {selectedDay.lunch.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-2 border-t border-blue-200 text-xs text-slate-500 font-semibold">
                  Est. Cost: {formatCurrency(selectedDay.lunch.estCost)}
                </div>
              </div>

              {/* Dinner */}
              <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      🌙 Dinner (Cook Once)
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      ~{selectedDay.dinner.estProtein}g Prot
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {selectedDay.dinner.title}
                  </h4>
                  <div className="text-[11px] font-bold text-indigo-700 mb-2">
                    Reheat Batch: {selectedDay.dinner.cookOnceRef}
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {selectedDay.dinner.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 pt-2 border-t border-indigo-200 text-xs text-slate-500 font-semibold">
                  Est. Cost: {formatCurrency(selectedDay.dinner.estCost)}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. AUTO-GENERATED SHOPPING LIST SUBTAB */}
      {activeSubTab === 'shopping' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                Weekly Auto-Generated Grocery List
              </h3>
              <p className="text-xs text-slate-500">
                Calculated directly from the 7-day meal plan. Check off items as you buy, then convert to expense in 1 tap!
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Weekly Est. Total</span>
              <span className="text-base font-black text-slate-900">{formatCurrency(totalEstimatedShopping)}</span>
            </div>
          </div>

          {/* Grouped Shopping Items */}
          <div className="space-y-4">
            {(['Protein', 'Carbohydrates', 'Fruits & Vegetables', 'Cooking & Extras'] as const).map((cat) => {
              const items = shoppingList.filter((s) => s.category === cat);
              if (items.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {cat} Items ({items.length})
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'p-3 rounded-xl border transition-all flex items-center justify-between text-xs',
                          item.checked ? 'bg-slate-50/80 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleShoppingItem(item.id)}
                            className={cn(
                              'w-5 h-5 rounded-md flex items-center justify-center border transition-colors',
                              item.checked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 hover:border-slate-400 bg-white'
                            )}
                          >
                            {item.checked && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <span className={cn('font-bold text-slate-900 block', item.checked && 'line-through text-slate-400')}>
                              {item.name}
                            </span>
                            <span className="text-slate-500 font-medium">{item.weeklyQuantity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {formatCurrency(item.estimatedPrice)}
                          </span>

                          {!item.convertedToExpense ? (
                            <button
                              onClick={() => convertShoppingItemToExpense(item.id)}
                              className="text-[11px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                              title="Log as real expense"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>Log Expense</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              ✓ Logged
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. AFFORDABLE VEGETABLE TRACKER SUBTAB */}
      {activeSubTab === 'vegetables' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Carrot className="w-5 h-5 text-emerald-600" />
                Affordable Local Vegetable Guide & Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Prioritize these high-yield, cheap Indian vegetables to maintain micronutrients while staying under budget.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Weekly Veggies Spend</span>
              <span className="text-base font-black text-emerald-700">{formatCurrency(weeklyVegetableSpendEstimate)}</span>
            </div>
          </div>

          {/* Grid of Vegetable Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {vegetables.map((veg) => (
              <div
                key={veg.id}
                onClick={() => toggleVegetablePurchased(veg.id)}
                className={cn(
                  'p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2',
                  veg.purchasedThisWeek
                    ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {veg.name}
                    </h4>
                    {veg.hindiName && (
                      <span className="text-[11px] text-slate-500 font-medium">({veg.hindiName})</span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                      veg.purchasedThisWeek ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                    )}
                  >
                    {veg.purchasedThisWeek ? '✓' : ''}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {veg.notes}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-600">Avg price:</span>
                  <span className="font-bold text-slate-900">~{formatCurrency(veg.avgPricePerKg)} / kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
