import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Receipt,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  PieChart as PieChartIcon,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { ExpenseCategory } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const BudgetTab: React.FC = () => {
  const {
    settings,
    expenses,
    currentMonthExpenses,
    monthlySpent,
    remainingBudget,
    percentBudgetUsed,
    averageDailySpend,
    estimatedMonthEndSpend,
    recommendedDailyBudgetRemaining,
    budgetStatus,
    availablePlannedFoodBudget,
    addExpense,
    removeExpense,
    setIsAddExpenseOpen,
    selectedMonth,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Category breakdown calculation
  const categoryTotals = useMemo(() => {
    const totals: Record<ExpenseCategory, number> = {
      Protein: 0,
      Carbohydrates: 0,
      'Fruits & Vegetables': 0,
      'Cooking & Extras': 0,
    };

    currentMonthExpenses.forEach((exp) => {
      if (totals[exp.category] !== undefined) {
        totals[exp.category] += exp.price;
      } else {
        totals['Protein'] += exp.price;
      }
    });

    return totals;
  }, [currentMonthExpenses]);

  // Chart data for category pie chart
  const pieData = useMemo(() => {
    const colors: Record<ExpenseCategory, string> = {
      Protein: '#3b82f6', // blue
      Carbohydrates: '#f59e0b', // amber
      'Fruits & Vegetables': '#10b981', // emerald
      'Cooking & Extras': '#8b5cf6', // purple
    };

    return (Object.entries(categoryTotals) as [ExpenseCategory, number][]).map(([name, value]) => ({
      name,
      value: Math.round(value),
      color: colors[name] || '#94a3b8',
    })).filter(d => d.value > 0);
  }, [categoryTotals]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return currentMonthExpenses.filter((exp) => {
      const matchSearch =
        exp.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategoryFilter === 'all' || exp.category === selectedCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [currentMonthExpenses, searchQuery, selectedCategoryFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="budget-tab-content">
      
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Monthly Budget & Expense Tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Strict ₹4,500 monthly limit with dedicated reserved pantry fund (~₹{settings.reservedExtrasBudget}) for spices & oil.
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2 shadow-xs shrink-0"
          id="btn-open-add-expense"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Grocery Expense</span>
        </button>
      </div>

      {/* Budget Warning Banner */}
      <div
        className={cn(
          'p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs',
          budgetStatus === 'on_track'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : budgetStatus === 'warning'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-red-50 border-red-300 text-red-950'
        )}
      >
        <div className="flex items-start gap-3">
          {budgetStatus === 'on_track' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-sm font-black">
              {budgetStatus === 'on_track' && "🟢 You're on track!"}
              {budgetStatus === 'warning' && "🟠 You're spending faster than planned!"}
              {budgetStatus === 'exceeded' && `🔴 Monthly budget exceeded by ${formatCurrency(Math.abs(remainingBudget))}`}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {budgetStatus === 'on_track' && `Keep daily grocery purchases under ${formatCurrency(recommendedDailyBudgetRemaining)}/day to finish the month with savings.`}
              {budgetStatus === 'warning' && `Spending pace is high. Tighten non-essential extras and rely on soy/chana staples.`}
              {budgetStatus === 'exceeded' && `Review logged expenses below to adjust subsequent purchases.`}
            </p>
          </div>
        </div>

        <div className="bg-white/90 px-3 py-2 rounded-xl border border-slate-200/60 shrink-0 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Recommended Daily Allowance</span>
          <span className="text-base font-black text-slate-900">{formatCurrency(recommendedDailyBudgetRemaining)} / day</span>
        </div>
      </div>

      {/* 4 Main Budget Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Monthly Budget
          </span>
          <span className="text-2xl font-black text-slate-900 block">
            {formatCurrency(settings.monthlyBudget)}
          </span>
          <div className="text-xs text-slate-500 mt-2 flex justify-between">
            <span>Planned: {formatCurrency(availablePlannedFoodBudget)}</span>
            <span>Extras: {formatCurrency(settings.reservedExtrasBudget)}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Spent So Far
          </span>
          <span className="text-2xl font-black text-blue-700 block">
            {formatCurrency(monthlySpent)}
          </span>
          <div className="text-xs text-slate-500 mt-2">
            <span>{percentBudgetUsed}% of monthly allowance used</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Remaining In Budget
          </span>
          <span className={cn('text-2xl font-black block', remainingBudget < 0 ? 'text-red-600' : 'text-emerald-700')}>
            {formatCurrency(remainingBudget)}
          </span>
          <div className="text-xs text-slate-500 mt-2">
            <span>{Math.max(0, 100 - percentBudgetUsed)}% safe margin</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Avg Daily Spend & Projection
          </span>
          <span className="text-2xl font-black text-slate-900 block">
            {formatCurrency(averageDailySpend)} <span className="text-xs text-slate-400 font-normal">/ day</span>
          </span>
          <div className="text-xs text-slate-500 mt-2">
            <span>Est. Month End: <strong>{formatCurrency(estimatedMonthEndSpend)}</strong></span>
          </div>
        </div>

      </div>

      {/* Reserved Fund & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Category Spending Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Category Spending Breakdown
              </h3>
              <p className="text-xs text-slate-500">Distribution across food groups for {selectedMonth}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Category Cards */}
            <div className="space-y-2.5">
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-blue-900 block">🥚 Protein (Eggs, Soy, Chana, Chicken, Paneer)</span>
                  <span className="text-slate-500">Core muscle building food</span>
                </div>
                <span className="text-sm font-black text-blue-700">{formatCurrency(categoryTotals['Protein'])}</span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">🍚 Carbohydrates (Rice, Chapathi, Muesli, Dosa)</span>
                  <span className="text-slate-500">Daily energy staples</span>
                </div>
                <span className="text-sm font-black text-amber-700">{formatCurrency(categoryTotals['Carbohydrates'])}</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">🥦 Fruits & Vegetables (Banana, Potato, Tomato, Palak)</span>
                  <span className="text-slate-500">Vitamins, minerals, fiber</span>
                </div>
                <span className="text-sm font-black text-emerald-700">{formatCurrency(categoryTotals['Fruits & Vegetables'])}</span>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-purple-900 block">🧂 Cooking & Extras (Oil, Salt, Spices, Masala)</span>
                  <span className="text-slate-500">Reserved fund allowance: {formatCurrency(settings.reservedExtrasBudget)}</span>
                </div>
                <span className="text-sm font-black text-purple-700">{formatCurrency(categoryTotals['Cooking & Extras'])}</span>
              </div>
            </div>

            {/* Recharts Pie Chart */}
            <div className="h-56 w-full flex items-center justify-center">
              {pieData.length === 0 ? (
                <div className="text-xs text-slate-400 text-center">No expenses to display in chart</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${formatCurrency(Number(val))}`, 'Spent']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Reserved Extras Budget Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Reserved Extras Fund
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Specially set aside every month for essential pantry cooking ingredients.
            </p>

            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Monthly Reserved:</span>
                <span className="font-bold text-purple-900">{formatCurrency(settings.reservedExtrasBudget)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-semibold">Spent this month:</span>
                <span className="font-bold text-purple-700">{formatCurrency(categoryTotals['Cooking & Extras'])}</span>
              </div>
              <div className="flex justify-between items-center border-t border-purple-200 pt-1.5">
                <span className="text-slate-700 font-bold">Extras Remaining:</span>
                <span className="font-black text-emerald-700">
                  {formatCurrency(Math.max(0, settings.reservedExtrasBudget - categoryTotals['Cooking & Extras']))}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Covered Pantry Items:
              </span>
              <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                {['Cooking Oil', 'Salt', 'Turmeric', 'Chilli Powder', 'Coriander Powder', 'Garam Masala', 'Mustard', 'Cumin', 'Ginger', 'Garlic', 'Curry Leaves'].map((i) => (
                  <span key={i} className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors"
          >
            + Log Oil / Spices Expense
          </button>
        </div>

      </div>

      {/* Expense History Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Expense Log ({filteredExpenses.length} entries)
            </h3>
            <p className="text-xs text-slate-500">Every grocery and food receipt for the current month</p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search expense..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="Protein">Protein</option>
              <option value="Carbohydrates">Carbohydrates</option>
              <option value="Fruits & Vegetables">Fruits & Veg</option>
              <option value="Cooking & Extras">Cooking & Extras</option>
            </select>
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 font-semibold">No expenses found matching filters.</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            <div className="grid grid-cols-12 bg-slate-50 p-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4 sm:col-span-4">Item & Quantity</div>
              <div className="col-span-3 sm:col-span-3">Category</div>
              <div className="col-span-3 sm:col-span-3">Date</div>
              <div className="col-span-2 sm:col-span-2 text-right">Price</div>
            </div>

            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="grid grid-cols-12 p-3 text-xs items-center hover:bg-slate-50/80 transition-colors"
              >
                <div className="col-span-4 sm:col-span-4 font-semibold text-slate-900">
                  <span>{exp.item}</span>
                  <span className="block sm:inline sm:ml-2 text-slate-400 font-normal">
                    ({exp.quantity})
                  </span>
                </div>

                <div className="col-span-3 sm:col-span-3">
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border truncate inline-block max-w-full',
                      exp.category === 'Protein'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : exp.category === 'Carbohydrates'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : exp.category === 'Fruits & Vegetables'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    )}
                  >
                    {exp.category}
                  </span>
                </div>

                <div className="col-span-3 sm:col-span-3 text-slate-500">
                  {exp.date}
                </div>

                <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(exp.price)}
                  </span>
                  <button
                    onClick={() => removeExpense(exp.id)}
                    className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
                    title="Delete expense"
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
