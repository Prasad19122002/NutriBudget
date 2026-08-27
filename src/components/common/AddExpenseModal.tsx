import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Receipt, Check, IndianRupee } from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { formatCurrency } from '../../lib/utils';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseOpen, setIsAddExpenseOpen, addExpense, selectedDate, settings } = useApp();

  const [item, setItem] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Protein');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState<string>('');
  const [date, setDate] = useState(selectedDate);
  const [justSaved, setJustSaved] = useState(false);

  const categories: ExpenseCategory[] = [
    'Protein',
    'Carbohydrates',
    'Fruits & Vegetables',
    'Cooking & Extras',
  ];

  const quickPresets = [
    { item: 'Eggs (Tray of 30)', category: 'Protein' as const, quantity: '30 pcs', price: '240' },
    { item: 'Soy Chunks Pack', category: 'Protein' as const, quantity: '500 g', price: '110' },
    { item: 'Chana / Moong Dal', category: 'Protein' as const, quantity: '1 kg', price: '90' },
    { item: 'Chicken (Curry Cut)', category: 'Protein' as const, quantity: '600 g', price: '150' },
    { item: 'Paneer 200g', category: 'Protein' as const, quantity: '200 g', price: '95' },
    { item: 'Rice Bag', category: 'Carbohydrates' as const, quantity: '2 kg', price: '110' },
    { item: 'Weekly Vegetables', category: 'Fruits & Vegetables' as const, quantity: 'Basket', price: '120' },
    { item: 'Cooking Oil & Masala', category: 'Cooking & Extras' as const, quantity: 'Refill', price: '130' },
  ];

  if (!isAddExpenseOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!item.trim() || isNaN(numPrice) || numPrice <= 0) return;

    addExpense({
      item: item.trim(),
      category,
      quantity: quantity.trim() || '1 unit',
      price: numPrice,
      date,
    });

    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setIsAddExpenseOpen(false);
      setItem('');
      setQuantity('');
      setPrice('');
    }, 400);
  };

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setItem(preset.item);
    setCategory(preset.category);
    setQuantity(preset.quantity);
    setPrice(preset.price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col"
        id="add-expense-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Add Grocery & Food Expense
            </h2>
            <p className="text-xs text-slate-500">Track spending towards your ₹4,500 monthly budget</p>
          </div>
          <button
            onClick={() => setIsAddExpenseOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            id="close-add-expense-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-3 space-y-4 flex-1">
          {/* Quick Preset Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                >
                  {p.item} ({formatCurrency(Number(p.price))})
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Category *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all text-center truncate ${
                    category === cat
                      ? 'bg-blue-50 text-blue-700 border-blue-400 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Item Name *</label>
            <input
              type="text"
              required
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="e.g. Eggs, Soy Chunks, Chicken, Vegetables..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              id="expense-item-input"
            />
          </div>

          {/* Price and Quantity Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  step="any"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="80"
                  className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-bold"
                  id="expense-price-input"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Quantity / Unit</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 10 pcs, 500g, 1 kg"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                id="expense-quantity-input"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              id="expense-date-input"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="w-1/3 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!item.trim() || !price}
              className={`w-2/3 py-2.5 px-4 text-xs sm:text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                justSaved
                  ? 'bg-emerald-600'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98'
              }`}
              id="btn-confirm-save-expense"
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Expense Saved!</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>Save Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
