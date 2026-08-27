import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  CookingPot,
  Sparkles,
  RefreshCw,
  Flame,
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { COOK_ONCE_RECIPES } from '../../data/initialData';

export const MealsTab: React.FC = () => {
  const {
    todayMeals,
    toggleMealCompleted,
    updateLunchProteinSource,
    todayLoggedFoods,
    removeFoodLog,
    setIsQuickAddOpen,
    todayProtein,
    settings,
    foodDatabase,
  } = useApp();

  const [selectedProteinOption, setSelectedProteinOption] = useState<string>('Soy chunks');
  const [lunchPortionGrams, setLunchPortionGrams] = useState<number>(50);
  const [lunchChanaGrams, setLunchChanaGrams] = useState<number>(50);
  const [lunchCurdGrams, setLunchCurdGrams] = useState<number>(250);

  const proteinOptions = [
    { name: 'Soy chunks', defaultGrams: 50, icon: '🌱' },
    { name: 'Chana', defaultGrams: 50, icon: '🌰' },
    { name: 'Green gram', defaultGrams: 50, icon: '🟢' },
    { name: 'Chicken', defaultGrams: 150, icon: '🍗' },
    { name: 'Paneer', defaultGrams: 100, icon: '🧀' },
    { name: 'Egg', defaultGrams: 2, icon: '🥚' },
  ];

  const handleApplyLunchCustomizer = () => {
    updateLunchProteinSource(selectedProteinOption, lunchPortionGrams, lunchChanaGrams, lunchCurdGrams);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="meals-tab-content">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-blue-600" />
            Daily 3-Meal Diet & Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tailored 3-meal plan for 56 kg body weight to achieve ~90g daily protein on a ₹4,500 budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-center">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Today Logged</span>
            <span className="text-sm font-black text-emerald-700">{Math.round(todayProtein)} / {settings.dailyProteinTarget}g</span>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food</span>
          </button>
        </div>
      </div>

      {/* 3 Main Meal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. BREAKFAST */}
        <div
          className={cn(
            'bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-xs',
            todayMeals.breakfast.completed ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
          )}
          id="meal-card-breakfast"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Breakfast</h3>
                  <span className="text-xs text-slate-400 font-medium">08:00 AM</span>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                ~25g Protein
              </span>
            </div>

            {/* Ingredients */}
            <div className="py-4 space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Planned Food Items
              </span>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-800">🥚 2 Eggs (Boiled/Omelette)</span>
                  <span className="text-emerald-700 font-bold">12.6 g • ₹16</span>
                </li>
                <li className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-800">🥣 50 g Muesli</span>
                  <span className="text-emerald-700 font-bold">5.0 g • ₹38</span>
                </li>
                <li className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-800">🥛 250 ml Toned Milk</span>
                  <span className="text-emerald-700 font-bold">8.0 g • ₹15</span>
                </li>
                <li className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                  <span className="font-semibold text-slate-800">🍌 1 Banana</span>
                  <span className="text-emerald-700 font-bold">1.2 g • ₹17</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-slate-900 block">Total: ~{todayMeals.breakfast.totalProtein}g</span>
              <span className="text-xs text-slate-500">Cost: ~{formatCurrency(todayMeals.breakfast.totalCost)}</span>
            </div>

            <button
              onClick={() => toggleMealCompleted('breakfast')}
              className={cn(
                'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs',
                todayMeals.breakfast.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {todayMeals.breakfast.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Mark as Done</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. LUNCH */}
        <div
          className={cn(
            'bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-xs',
            todayMeals.lunch.completed ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
          )}
          id="meal-card-lunch"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Lunch</h3>
                  <span className="text-xs text-slate-400 font-medium">01:30 PM (Office/Tiffin)</span>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                ~{todayMeals.lunch.totalProtein}g Protein
              </span>
            </div>

            {/* Protein Source Switcher */}
            <div className="py-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Switch Protein Source:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {proteinOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      setSelectedProteinOption(opt.name);
                      setLunchPortionGrams(opt.defaultGrams);
                      updateLunchProteinSource(opt.name, opt.defaultGrams, lunchChanaGrams, lunchCurdGrams);
                    }}
                    className={cn(
                      'py-1 px-1.5 text-[11px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1',
                      selectedProteinOption === opt.name
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredient Quantities */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800">🍚 100g Rice</span>
                <span className="text-slate-600">7g • ₹7</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100">
                <span className="font-bold text-blue-900">{selectedProteinOption} ({lunchPortionGrams}g)</span>
                <span className="text-blue-700 font-bold">Main Protein</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800">🌰 {lunchChanaGrams}g Chana / Moong</span>
                <span className="text-slate-600">10g • ₹9.5</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800">🍶 {lunchCurdGrams}g Curd & Veggies</span>
                <span className="text-slate-600">10.5g • ₹37</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
            <div>
              <span className="text-xs font-black text-slate-900 block">Total: ~{todayMeals.lunch.totalProtein}g</span>
              <span className="text-xs text-slate-500">Cost: ~{formatCurrency(todayMeals.lunch.totalCost)}</span>
            </div>

            <button
              onClick={() => toggleMealCompleted('lunch')}
              className={cn(
                'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs',
                todayMeals.lunch.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {todayMeals.lunch.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Mark as Done</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. DINNER */}
        <div
          className={cn(
            'bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-xs',
            todayMeals.dinner.completed ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
          )}
          id="meal-card-dinner"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Dinner</h3>
                  <span className="text-xs text-slate-400 font-medium">08:30 PM (Quick Reheat)</span>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200">
                Cook Once Strategy
              </span>
            </div>

            <div className="my-3 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 flex items-start gap-2">
              <CookingPot className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Work-Friendly Rule:</strong> Reheat the second half of the curry cooked during Lunch prep to eliminate night cooking!
              </span>
            </div>

            {/* Ingredients */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800">🍲 Batch Curry (Lunch leftover portion)</span>
                <span className="text-emerald-700 font-bold">20g • ₹15</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800">🫓 2 Chapathis OR 100g Rice</span>
                <span className="text-emerald-700 font-bold">6g • ₹12</span>
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-semibold text-slate-800">🥚 2 Boiled/Fried Eggs (Boost)</span>
                <span className="text-emerald-700 font-bold">12.6g • ₹16</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
            <div>
              <span className="text-xs font-black text-slate-900 block">Total: ~{todayMeals.dinner.totalProtein}g</span>
              <span className="text-xs text-slate-500">Cost: ~{formatCurrency(todayMeals.dinner.totalCost)}</span>
            </div>

            <button
              onClick={() => toggleMealCompleted('dinner')}
              className={cn(
                'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs',
                todayMeals.dinner.completed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {todayMeals.dinner.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Mark as Done</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* "Cook Once" Batch Recipe Guide */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CookingPot className="w-5 h-5 text-blue-600" />
              "Cook Once" 2-Meal Batch Preparation Recipes
            </h3>
            <p className="text-xs text-slate-500">
              Prepare a single big batch in 20 mins → Split cleanly into 🍱 Lunch + 🌙 Dinner
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COOK_ONCE_RECIPES.map((recipe) => (
            <div key={recipe.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{recipe.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{recipe.description}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 shrink-0">
                  {recipe.totalProtein}g Prot • {formatCurrency(recipe.totalCost)}
                </span>
              </div>

              {/* Ingredients breakdown */}
              <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200/70 space-y-1">
                <span className="font-bold text-slate-700 block">Prepare at once:</span>
                <div className="flex flex-wrap gap-2 text-slate-600">
                  {recipe.ingredients.map((ing, idx) => (
                    <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {ing.name} ({ing.amount})
                    </span>
                  ))}
                </div>
              </div>

              {/* Portions split */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg">
                  <span className="font-bold text-blue-900 block">🍱 Lunch Tiffin:</span>
                  <span className="text-blue-800 text-[11px]">{recipe.lunchPortion}</span>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                  <span className="font-bold text-indigo-900 block">🌙 Dinner Reheat:</span>
                  <span className="text-indigo-800 text-[11px]">{recipe.dinnerPortion}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic bg-amber-50/70 p-2 rounded border border-amber-100">
                💡 <strong>Work Tip:</strong> {recipe.workFriendlyTip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Logged Foods Feed */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Today's Logged Food Stream ({todayLoggedFoods.length} items)
            </h3>
            <p className="text-xs text-slate-500">Every food item logged for selected date</p>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {todayLoggedFoods.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-500">No foods logged yet for this date.</p>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              + Quick Add Food
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {todayLoggedFoods.map((food) => (
              <div
                key={food.id}
                className="p-3 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <span className="font-bold text-slate-900 block sm:inline mr-2">{food.name}</span>
                    <span className="text-slate-500">
                      ({food.servingAmountText} • {food.mealSlot || 'snack'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-700">+{food.protein}g protein</span>
                  <span className="text-slate-600 font-semibold">{formatCurrency(food.cost)}</span>
                  <button
                    onClick={() => removeFoodLog(food.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
