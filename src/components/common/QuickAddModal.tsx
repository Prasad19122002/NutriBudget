import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Plus, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { FoodItem } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    foodDatabase,
    addFoodLog,
    selectedDate,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(foodDatabase[0] || null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mealSlot, setMealSlot] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
  const [justAdded, setJustAdded] = useState(false);

  // Quick preset foods
  const quickItems = useMemo(() => {
    const popularKeys = ['egg', 'soy_chunks', 'chicken', 'paneer', 'chana', 'green_gram', 'milk', 'curd', 'banana'];
    return foodDatabase.filter((f) => popularKeys.includes(f.id));
  }, [foodDatabase]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return foodDatabase;
    return foodDatabase.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [foodDatabase, searchQuery]);

  if (!isQuickAddOpen) return null;

  const currentFood = selectedFood || foodDatabase[0];
  const calculatedProtein = currentFood ? Math.round(currentFood.protein * quantity * 10) / 10 : 0;
  const calculatedCost = currentFood ? Math.round(currentFood.price * quantity * 10) / 10 : 0;
  const servingAmount = currentFood ? `${Math.round(currentFood.servingSize * quantity)} ${currentFood.servingUnit}` : '';

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFood) return;

    addFoodLog(currentFood.id, quantity, mealSlot);
    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
      setIsQuickAddOpen(false);
      setQuantity(1);
    }, 400);
  };

  const handleQuickSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col"
        id="quick-add-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Fast Food Logger
            </h2>
            <p className="text-xs text-slate-500">Log protein and cost to today in seconds</p>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            id="close-quick-add-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          {/* Quick Select Badges */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Popular Staples (One-Tap Select)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickItems.map((food) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleQuickSelect(food)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    currentFood?.id === food.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-102'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{food.icon || '🍽️'}</span>
                  <span>{food.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Dropdown/List */}
          <div>
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food (e.g. Soy, Chicken, Eggs, Paneer)..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                id="search-food-input"
              />
            </div>

            {searchQuery && (
              <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                {filteredFoods.length === 0 ? (
                  <p className="text-xs text-slate-400 p-2 text-center">No food found matching query</p>
                ) : (
                  filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => {
                        setSelectedFood(food);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{food.name}</span>
                      <span className="text-slate-500">
                        {food.protein}g protein • {formatCurrency(food.price)} / {food.servingSize}{food.servingUnit}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Food Calculator Card */}
          {currentFood && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentFood.icon || '🥣'}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{currentFood.name}</h3>
                    <p className="text-xs text-slate-500">
                      Standard serving: {currentFood.servingSize} {currentFood.servingUnit} (₹{currentFood.price} • {currentFood.protein}g protein)
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Quantity / Multiplier:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-slate-900 bg-white border border-blue-300 rounded-md py-0.5">
                      {quantity}x
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.round((q + 0.5) * 10) / 10)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-600 bg-white/80 p-2 rounded-lg border border-blue-100">
                  <span>Portion: <strong>{servingAmount}</strong></span>
                  <span>Unit Cost: <strong>{formatCurrency(calculatedCost)}</strong></span>
                </div>
              </div>

              {/* Instant Calculation Preview */}
              <div className="mt-3 pt-3 border-t border-blue-200/60 grid grid-cols-2 gap-2 text-center">
                <div className="bg-emerald-100/80 border border-emerald-200 rounded-lg p-2">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Protein</span>
                  <span className="text-lg font-black text-emerald-700">+{calculatedProtein} g</span>
                </div>
                <div className="bg-blue-100/80 border border-blue-200 rounded-lg p-2">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block">Est. Cost</span>
                  <span className="text-lg font-black text-blue-700">+{formatCurrency(calculatedCost)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Meal Slot Selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Log into Meal Category
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setMealSlot(slot)}
                  className={`py-1.5 text-xs font-semibold capitalize rounded-lg border transition-all ${
                    mealSlot === slot
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(false)}
            className="w-1/3 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLog}
            disabled={!currentFood}
            className={`w-2/3 py-2.5 px-4 text-xs sm:text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
              justAdded
                ? 'bg-emerald-600'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
            }`}
            id="btn-confirm-add-food"
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Logged to Today!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add +{calculatedProtein}g Protein</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
