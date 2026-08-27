import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, RotateCcw, Plus, Trash2, Edit2, Database, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { FoodItem, ExpenseCategory } from '../../types';
import { INITIAL_FOOD_DATABASE, INITIAL_USER_SETTINGS } from '../../data/initialData';
import { formatCurrency } from '../../lib/utils';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSettings,
    foodDatabase,
    updateFoodItem,
    addFoodItem,
    deleteFoodItem,
    resetForNewMonth,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'food_db' | 'reset'>('general');
  const [formSettings, setFormSettings] = useState({ ...settings });
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Food Form State
  const [newFood, setNewFood] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    category: 'Protein',
    servingSize: 100,
    servingUnit: 'g',
    price: 30,
    protein: 10,
    icon: '🍽️',
  });

  if (!isSettingsOpen) return null;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSaveFoodEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood) return;
    updateFoodItem(editingFood);
    setEditingFood(null);
  };

  const handleAddFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;
    addFoodItem(newFood);
    setIsAddingFood(false);
    setNewFood({
      name: '',
      category: 'Protein',
      servingSize: 100,
      servingUnit: 'g',
      price: 30,
      protein: 10,
      icon: '🍽️',
    });
  };

  const handleResetFoodDb = () => {
    if (window.confirm('Reset all food items and prices to initial defaults?')) {
      INITIAL_FOOD_DATABASE.forEach((f) => updateFoodItem(f));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col"
        id="settings-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Settings & Food Database
            </h2>
            <p className="text-xs text-slate-500">Configure budget limits, protein targets & food prices</p>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            id="close-settings-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 mt-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            General & Budget
          </button>
          <button
            onClick={() => setActiveTab('food_db')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'food_db'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Food Database ({foodDatabase.length})
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'reset'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Month Reset & Data
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="overflow-y-auto py-4 flex-1 space-y-4">
          {activeTab === 'general' && (
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Monthly Budget */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Monthly Food Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="50"
                    value={formSettings.monthlyBudget}
                    onChange={(e) =>
                      setFormSettings({ ...formSettings, monthlyBudget: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Default target: ₹4,500/month</p>
                </div>

                {/* Reserved Extras Budget */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Reserved Extras Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="25"
                    value={formSettings.reservedExtrasBudget}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        reservedExtrasBudget: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Set aside for oil, salt, spices, masala (~₹400–₹500)
                  </p>
                </div>

                {/* Daily Protein Target */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Daily Protein Target (g)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={formSettings.dailyProteinTarget}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        dailyProteinTarget: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Target for 56 kg lean muscle gain: ~90 g/day</p>
                </div>

                {/* Starting Weight */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Starting Baseline Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formSettings.startingWeight}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        startingWeight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Starting baseline: 56 kg</p>
                </div>

              </div>

              {/* Calculated available planned budget display */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex justify-between items-center">
                <div>
                  <span className="font-bold block">Available Planned Food Budget:</span>
                  <span>{formatCurrency(formSettings.monthlyBudget - formSettings.reservedExtrasBudget)}</span>
                </div>
                <div>
                  <span className="font-bold block text-right">Reserved Extras:</span>
                  <span className="text-right block">{formatCurrency(formSettings.reservedExtrasBudget)}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 shadow-xs"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'food_db' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Edit prices, serving sizes, and protein values to match your local market prices.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddingFood(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Food</span>
                  </button>
                  <button
                    onClick={handleResetFoodDb}
                    title="Reset to initial values"
                    className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add Food Form */}
              {isAddingFood && (
                <form onSubmit={handleAddFoodSubmit} className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-900">Add New Food Item</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingFood(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Food Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Soya Chunks"
                        value={newFood.name}
                        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Category</label>
                      <select
                        value={newFood.category}
                        onChange={(e) => setNewFood({ ...newFood, category: e.target.value as ExpenseCategory })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      >
                        <option value="Protein">Protein</option>
                        <option value="Carbohydrates">Carbohydrates</option>
                        <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                        <option value="Cooking & Extras">Cooking & Extras</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Serving Size</label>
                      <input
                        type="number"
                        min="1"
                        value={newFood.servingSize}
                        onChange={(e) => setNewFood({ ...newFood, servingSize: parseFloat(e.target.value) || 1 })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Unit (e.g. g, ml, pc)</label>
                      <input
                        type="text"
                        value={newFood.servingUnit}
                        onChange={(e) => setNewFood({ ...newFood, servingUnit: e.target.value })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Price (₹)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newFood.price}
                        onChange={(e) => setNewFood({ ...newFood, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newFood.protein}
                        onChange={(e) => setNewFood({ ...newFood, protein: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                  >
                    Save Food Item
                  </button>
                </form>
              )}

              {/* Edit Modal / Inline form if editing */}
              {editingFood && (
                <form onSubmit={handleSaveFoodEdit} className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900">Editing: {editingFood.name}</span>
                    <button
                      type="button"
                      onClick={() => setEditingFood(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Serving Size</label>
                      <input
                        type="number"
                        value={editingFood.servingSize}
                        onChange={(e) =>
                          setEditingFood({ ...editingFood, servingSize: parseFloat(e.target.value) || 1 })
                        }
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Unit</label>
                      <input
                        type="text"
                        value={editingFood.servingUnit}
                        onChange={(e) => setEditingFood({ ...editingFood, servingUnit: e.target.value })}
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Price (₹)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingFood.price}
                        onChange={(e) =>
                          setEditingFood({ ...editingFood, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingFood.protein}
                        onChange={(e) =>
                          setEditingFood({ ...editingFood, protein: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {/* Food Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                <div className="grid grid-cols-12 bg-slate-50 p-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-4">Food</div>
                  <div className="col-span-3">Serving</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Protein</div>
                  <div className="col-span-1 text-right">Edit</div>
                </div>

                {foodDatabase.map((food) => (
                  <div key={food.id} className="grid grid-cols-12 p-2 text-xs items-center hover:bg-slate-50/80 transition-colors">
                    <div className="col-span-4 font-semibold text-slate-800 flex items-center gap-1.5">
                      <span>{food.icon || '🍽️'}</span>
                      <span className="truncate">{food.name}</span>
                    </div>
                    <div className="col-span-3 text-slate-600">
                      {food.servingSize} {food.servingUnit}
                    </div>
                    <div className="col-span-2 font-bold text-blue-700">
                      {formatCurrency(food.price)}
                    </div>
                    <div className="col-span-2 font-bold text-emerald-700">
                      ~{food.protein} g
                    </div>
                    <div className="col-span-1 flex justify-end gap-1">
                      <button
                        onClick={() => setEditingFood(food)}
                        className="p-1 text-slate-500 hover:text-blue-600 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!food.isDefault && (
                        <button
                          onClick={() => deleteFoodItem(food.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Monthly Reset & Archive
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  At the beginning of a new month, archiving preserves your spending history and averages while resetting the active month expense tally.
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => {
                      if (window.confirm('Archive current month and reset active expense tracker?')) {
                        resetForNewMonth();
                        alert('Month successfully archived! Ready for the new month.');
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                  >
                    Archive & Start New Month
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                <h4 className="font-bold text-slate-800 mb-1">Data Storage & Backup</h4>
                <p>
                  All your data (daily meals, protein records, ₹4,500 budget expenses, weight history, and custom foods) is securely preserved in your local browser storage.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
