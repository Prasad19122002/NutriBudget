import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Scale, Check, Plus, Minus } from 'lucide-react';

export const LogWeightModal: React.FC = () => {
  const { isLogWeightOpen, setIsLogWeightOpen, settings, addWeightEntry, selectedDate } = useApp();

  const [weight, setWeight] = useState<number>(settings.currentWeight || 56.0);
  const [date, setDate] = useState<string>(selectedDate);
  const [notes, setNotes] = useState<string>('');
  const [justSaved, setJustSaved] = useState(false);

  if (!isLogWeightOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || isNaN(weight) || weight <= 0) return;

    addWeightEntry(weight, date, notes.trim());
    setJustSaved(true);
    setTimeout(() => {
      setJustSaved(false);
      setIsLogWeightOpen(false);
      setNotes('');
    }, 400);
  };

  const weightDifference = Math.round((weight - settings.startingWeight) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden relative"
        id="log-weight-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Log Body Weight
            </h2>
            <p className="text-xs text-slate-500">Track lean muscle gain progress (23y / 56 kg)</p>
          </div>
          <button
            onClick={() => setIsLogWeightOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            id="close-log-weight-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Main Weight Input with large stepper */}
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 text-center">
            <label className="text-xs font-bold text-purple-800 uppercase tracking-wider block mb-2">
              Current Weight (kg)
            </label>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setWeight((w) => Math.max(30, Math.round((w - 0.1) * 10) / 10))}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-purple-200 font-bold text-purple-800 hover:bg-purple-100 active:scale-95 shadow-xs"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-baseline justify-center">
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="150"
                  required
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 56)}
                  className="w-24 text-center text-3xl font-black text-slate-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
                  id="weight-input-field"
                />
                <span className="text-sm font-bold text-slate-500 ml-1">kg</span>
              </div>

              <button
                type="button"
                onClick={() => setWeight((w) => Math.round((w + 0.1) * 10) / 10)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-purple-200 font-bold text-purple-800 hover:bg-purple-100 active:scale-95 shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2 text-xs font-semibold text-purple-700">
              {weightDifference >= 0 ? `+${weightDifference} kg` : `${weightDifference} kg`} from starting ({settings.startingWeight} kg)
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="weight-date-input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Optional Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Weighed in morning after workout"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="weight-note-input"
            />
          </div>

          {/* Action */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsLogWeightOpen(false)}
              className="w-1/3 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-2/3 py-2.5 px-4 text-xs sm:text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${
                justSaved
                  ? 'bg-emerald-600'
                  : 'bg-purple-600 hover:bg-purple-700 active:scale-98'
              }`}
              id="btn-confirm-save-weight"
            >
              {justSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Save Weight</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
