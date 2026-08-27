import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Scale,
  Plus,
  TrendingUp,
  History,
  Sparkles,
  Trash2,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';

export const ProgressTab: React.FC = () => {
  const {
    settings,
    todayProtein,
    todayProteinBreakdown,
    sevenDayAverageProtein,
    dailyProteinHistory,
    weightEntries,
    addWeightEntry,
    deleteWeightEntry,
    setIsLogWeightOpen,
    monthlyArchives,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'protein' | 'weight' | 'history'>('protein');

  const weightDiff = Math.round((settings.currentWeight - settings.startingWeight) * 10) / 10;

  // Format weight entries for Recharts
  const weightChartData = weightEntries.map((w) => ({
    displayDate: w.displayDate || w.date.slice(5),
    weight: w.weight,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" id="progress-tab-content">
      
      {/* Tab Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5">
        <button
          onClick={() => setActiveSection('protein')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all',
            activeSection === 'protein'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          id="btn-progress-protein-tab"
        >
          <Dumbbell className="w-4 h-4" />
          <span>Protein Intake ({Math.round(todayProtein)}g)</span>
        </button>

        <button
          onClick={() => setActiveSection('weight')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all',
            activeSection === 'weight'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          id="btn-progress-weight-tab"
        >
          <Scale className="w-4 h-4" />
          <span>Weight Tracker ({settings.currentWeight} kg)</span>
        </button>

        <button
          onClick={() => setActiveSection('history')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all',
            activeSection === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
          id="btn-progress-history-tab"
        >
          <History className="w-4 h-4" />
          <span>Monthly Archives</span>
        </button>
      </div>

      {/* 1. PROTEIN TRACKER SECTION */}
      {activeSection === 'protein' && (
        <div className="space-y-5">
          {/* Top Protein Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Today's Total Protein
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{Math.round(todayProtein)}</span>
                <span className="text-sm font-semibold text-slate-400">/ {settings.dailyProteinTarget} g</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-emerald-700">
                {todayProtein >= settings.dailyProteinTarget ? '🎯 Daily 90g goal achieved!' : `${Math.max(0, Math.round(settings.dailyProteinTarget - todayProtein))} g remaining today`}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                7-Day Daily Average
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-600">{sevenDayAverageProtein}</span>
                <span className="text-sm font-semibold text-slate-400">g / day</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Consistency is key for 56 kg lean muscle gain
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Protein per kg Bodyweight
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600">
                  {Math.round((todayProtein / settings.currentWeight) * 10) / 10}
                </span>
                <span className="text-sm font-semibold text-slate-400">g / kg</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Optimal target: 1.6 g/kg (~90g for 56 kg)
              </div>
            </div>

          </div>

          {/* 7-Day Protein Bar Chart */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  7-Day Daily Protein Trend (g)
                </h3>
                <p className="text-xs text-slate-500">Target reference line at {settings.dailyProteinTarget}g/day</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyProteinHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                  <Tooltip
                    formatter={(val: any) => [`${val} g`, 'Protein']}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <ReferenceLine y={settings.dailyProteinTarget} stroke="#10b981" strokeDasharray="3 3" label={{ value: '90g Goal', fill: '#10b981', fontSize: 11, position: 'top' }} />
                  <Bar dataKey="protein" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Protein Breakdown by Food Source */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Today's Protein Source Breakdown
              </h3>
              <p className="text-xs text-slate-500">Detailed contribution from each food staple</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(todayProteinBreakdown).map(([source, grams]) => {
                const icons: Record<string, string> = {
                  Eggs: '🥚',
                  Soy: '🌱',
                  Chana: '🌰',
                  'Green gram': '🟢',
                  Chicken: '🍗',
                  Paneer: '🧀',
                  Milk: '🥛',
                  Curd: '🍶',
                  Other: '🥣',
                };
                return (
                  <div key={source} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                      <span>{icons[source] || '🍽️'}</span>
                      <span className="font-semibold">{source}</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 block">
                      {grams} <span className="text-xs font-semibold text-slate-400">g</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. WEIGHT TRACKER SECTION */}
      {activeSection === 'weight' && (
        <div className="space-y-5">
          {/* Top Weight KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Starting Baseline Weight
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-700">{settings.startingWeight}</span>
                <span className="text-sm font-semibold text-slate-400">kg</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">Baseline recorded at start</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Current Recorded Weight
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-purple-700">{settings.currentWeight}</span>
                <span className="text-sm font-semibold text-slate-400">kg</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-purple-700">
                {weightDiff >= 0 ? `+${weightDiff} kg gained` : `${weightDiff} kg`}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Target Weight Goal
                </span>
                <div className="text-2xl font-black text-slate-900">
                  60.0 <span className="text-sm font-semibold text-slate-400">kg (Lean Muscle)</span>
                </div>
              </div>

              <button
                onClick={() => setIsLogWeightOpen(true)}
                className="mt-3 w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                id="btn-open-log-weight"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log New Weigh-In</span>
              </button>
            </div>

          </div>

          {/* Weight Progress Line Chart */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Bodyweight Progress Trend (kg)
                </h3>
                <p className="text-xs text-slate-500">Aiming for gradual, healthy lean weight gain (~0.2-0.4 kg/week)</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} kg`, 'Weight']}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#9333ea" strokeWidth={3} dot={{ r: 5, fill: '#9333ea' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight History Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Weight Log History
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="grid grid-cols-12 bg-slate-50 p-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">Date</div>
                <div className="col-span-3">Weight</div>
                <div className="col-span-4">Notes</div>
                <div className="col-span-1 text-right">Delete</div>
              </div>

              {weightEntries.map((w) => (
                <div key={w.id} className="grid grid-cols-12 p-3 text-xs items-center hover:bg-slate-50/80 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-800">
                    {w.date} ({w.displayDate})
                  </div>
                  <div className="col-span-3 font-bold text-purple-700 text-sm">
                    {w.weight} kg
                  </div>
                  <div className="col-span-4 text-slate-500 truncate">
                    {w.notes || '—'}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => deleteWeightEntry(w.id)}
                      className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MONTHLY ARCHIVES SECTION */}
      {activeSection === 'history' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Monthly Historical Archive
            </h3>
            <p className="text-xs text-slate-500">Summary records of previous tracking months</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthlyArchives.map((m) => (
              <div key={m.monthKey} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">{m.monthLabel}</h4>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Spent: {formatCurrency(m.totalSpent)} / {formatCurrency(m.budget)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">Daily Average Spend:</span>
                    <span className="font-bold text-slate-900 block">{formatCurrency(m.averageDailySpend)}/day</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Avg Protein:</span>
                    <span className="font-bold text-blue-700 block">{m.avgDailyProtein} g/day</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Month End Weight:</span>
                    <span className="font-bold text-purple-700 block">{m.endWeight} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Days Tracked:</span>
                    <span className="font-bold text-slate-900 block">{m.daysLogged} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
