import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  TabType,
  FoodItem,
  MealSlot,
  LoggedFood,
  Expense,
  WeightEntry,
  DayPlan,
  VegetableItem,
  ShoppingItem,
  UserSettings,
  MonthlySummary,
  ExpenseCategory,
} from '../types';
import {
  INITIAL_USER_SETTINGS,
  INITIAL_FOOD_DATABASE,
  INITIAL_WEEKLY_PLAN,
  INITIAL_AFFORDABLE_VEGETABLES,
  INITIAL_SHOPPING_LIST,
  INITIAL_WEIGHT_LOG,
  COOK_ONCE_RECIPES,
} from '../data/initialData';
import { getTodayDateString, getMonthKey, getDaysInMonth, triggerProteinGoalConfetti } from '../lib/utils';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  
  // Food Database
  foodDatabase: FoodItem[];
  updateFoodItem: (item: FoodItem) => void;
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  deleteFoodItem: (id: string) => void;
  
  // Meals & Logs
  todayMeals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    dinner: MealSlot;
  };
  toggleMealCompleted: (slotId: 'breakfast' | 'lunch' | 'dinner') => void;
  updateLunchProteinSource: (sourceName: string, portionSizeGrams: number, chanaGrams?: number, curdGrams?: number) => void;
  loggedFoods: LoggedFood[];
  todayLoggedFoods: LoggedFood[];
  addFoodLog: (foodId: string, quantity: number, mealSlot?: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  removeFoodLog: (id: string) => void;
  
  // Expenses & Budget
  expenses: Expense[];
  currentMonthExpenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  
  // Derived Budget Metrics
  monthlySpent: number;
  remainingBudget: number;
  percentBudgetUsed: number;
  averageDailySpend: number;
  estimatedMonthEndSpend: number;
  recommendedDailyBudgetRemaining: number;
  budgetStatus: 'on_track' | 'warning' | 'exceeded';
  availablePlannedFoodBudget: number;
  
  // Derived Protein Metrics
  todayProtein: number;
  todayProteinBreakdown: Record<string, number>;
  sevenDayAverageProtein: number;
  dailyProteinHistory: { date: string; displayDate: string; protein: number; goal: number }[];
  todayMealsCompletedCount: number;
  
  // Weight Tracker
  weightEntries: WeightEntry[];
  addWeightEntry: (weight: number, date?: string, notes?: string) => void;
  deleteWeightEntry: (id: string) => void;
  
  // Weekly Plan, Shopping & Vegetables
  weeklyPlan: DayPlan[];
  updateDayPlan: (index: number, plan: DayPlan) => void;
  shoppingList: ShoppingItem[];
  toggleShoppingItem: (id: string) => void;
  convertShoppingItemToExpense: (id: string) => void;
  vegetables: VegetableItem[];
  toggleVegetablePurchased: (id: string) => void;
  weeklyVegetableSpendEstimate: number;
  
  // Monthly Reset & History
  monthlyArchives: MonthlySummary[];
  resetForNewMonth: (monthKey?: string) => void;
  
  // Modals helper
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isLogWeightOpen: boolean;
  setIsLogWeightOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'ft_user_settings_v1',
  FOOD_DB: 'ft_food_database_v1',
  LOGGED_FOODS: 'ft_logged_foods_v1',
  MEAL_COMPLETIONS: 'ft_meal_completions_v1',
  EXPENSES: 'ft_expenses_v1',
  WEIGHT_ENTRIES: 'ft_weight_entries_v1',
  WEEKLY_PLAN: 'ft_weekly_plan_v1',
  SHOPPING_LIST: 'ft_shopping_list_v1',
  VEGETABLES: 'ft_vegetables_v1',
  MONTHLY_ARCHIVES: 'ft_monthly_archives_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to parse localStorage for ${key}`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save localStorage for ${key}`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedMonth, setSelectedMonth] = useState<string>(getMonthKey());

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Core Persistent States
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadStorage(STORAGE_KEYS.SETTINGS, INITIAL_USER_SETTINGS)
  );

  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(() =>
    loadStorage(STORAGE_KEYS.FOOD_DB, INITIAL_FOOD_DATABASE)
  );

  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>(() => {
    const saved = loadStorage<LoggedFood[]>(STORAGE_KEYS.LOGGED_FOODS, []);
    if (saved.length > 0) return saved;

    // Seed some initial logged food for today so the user sees a rich working dashboard
    const today = getTodayDateString();
    return [
      {
        id: 'seed_bf_1',
        foodId: 'egg',
        name: 'Egg',
        category: 'Protein',
        quantity: 2,
        servingAmountText: '2 pieces',
        protein: 12.6,
        cost: 16,
        mealSlot: 'breakfast',
        timestamp: `${today}T08:15:00`,
      },
      {
        id: 'seed_bf_2',
        foodId: 'muesli',
        name: 'Muesli',
        category: 'Carbohydrates',
        quantity: 1,
        servingAmountText: '50 g',
        protein: 5.0,
        cost: 38,
        mealSlot: 'breakfast',
        timestamp: `${today}T08:15:00`,
      },
      {
        id: 'seed_bf_3',
        foodId: 'milk',
        name: 'Milk',
        category: 'Protein',
        quantity: 1,
        servingAmountText: '250 ml',
        protein: 8.0,
        cost: 15,
        mealSlot: 'breakfast',
        timestamp: `${today}T08:15:00`,
      },
      {
        id: 'seed_bf_4',
        foodId: 'banana',
        name: 'Banana',
        category: 'Fruits & Vegetables',
        quantity: 1,
        servingAmountText: '1 piece',
        protein: 1.2,
        cost: 17,
        mealSlot: 'breakfast',
        timestamp: `${today}T08:15:00`,
      },
      {
        id: 'seed_lu_1',
        foodId: 'soy_chunks',
        name: 'Soy chunks',
        category: 'Protein',
        quantity: 1,
        servingAmountText: '50 g dry',
        protein: 26.0,
        cost: 25,
        mealSlot: 'lunch',
        timestamp: `${today}T13:30:00`,
      },
      {
        id: 'seed_lu_2',
        foodId: 'chana',
        name: 'Chana (Black/Kabuli)',
        category: 'Protein',
        quantity: 1,
        servingAmountText: '50 g dry',
        protein: 10.0,
        cost: 9.5,
        mealSlot: 'lunch',
        timestamp: `${today}T13:30:00`,
      },
      {
        id: 'seed_lu_3',
        foodId: 'curd',
        name: 'Curd / Dahi',
        category: 'Protein',
        quantity: 1,
        servingAmountText: '250 g',
        protein: 8.5,
        cost: 25,
        mealSlot: 'lunch',
        timestamp: `${today}T13:30:00`,
      },
      {
        id: 'seed_lu_4',
        foodId: 'rice',
        name: 'Rice',
        category: 'Carbohydrates',
        quantity: 1,
        servingAmountText: '100 g dry',
        protein: 7.0,
        cost: 7,
        mealSlot: 'lunch',
        timestamp: `${today}T13:30:00`,
      },
    ];
  });

  const [mealCompletions, setMealCompletions] = useState<Record<string, { breakfast?: boolean; lunch?: boolean; dinner?: boolean }>>(() => {
    const today = getTodayDateString();
    return loadStorage(STORAGE_KEYS.MEAL_COMPLETIONS, {
      [today]: { breakfast: true, lunch: true, dinner: false },
    });
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = loadStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
    if (saved.length > 0) return saved;

    const currentM = getMonthKey();
    return [
      { id: 'exp_1', date: `${currentM}-02`, item: 'Eggs (Tray of 30)', category: 'Protein', quantity: '30 pcs', price: 240, createdAt: `${currentM}-02T10:00:00` },
      { id: 'exp_2', date: `${currentM}-03`, item: 'Rice 5kg Bag', category: 'Carbohydrates', quantity: '5 kg', price: 320, createdAt: `${currentM}-03T11:00:00` },
      { id: 'exp_3', date: `${currentM}-06`, item: 'Soy Chunks 1kg Pack', category: 'Protein', quantity: '1 kg', price: 210, createdAt: `${currentM}-06T09:30:00` },
      { id: 'exp_4', date: `${currentM}-08`, item: 'Black Chana & Moong Dal', category: 'Protein', quantity: '1 kg each', price: 185, createdAt: `${currentM}-08T18:00:00` },
      { id: 'exp_5', date: `${currentM}-10`, item: 'Sunflower Cooking Oil (1L) & Salt', category: 'Cooking & Extras', quantity: '1 bottle', price: 175, createdAt: `${currentM}-10T12:00:00` },
      { id: 'exp_6', date: `${currentM}-12`, item: 'Fresh Chicken Curry Cut', category: 'Protein', quantity: '600 g', price: 150, createdAt: `${currentM}-12T17:00:00` },
      { id: 'exp_7', date: `${currentM}-15`, item: 'Muesli Pack (1kg)', category: 'Carbohydrates', quantity: '1 kg', price: 340, createdAt: `${currentM}-15T10:00:00` },
      { id: 'exp_8', date: `${currentM}-18`, item: 'Weekly Vegetables (Potato, Onion, Tomato, Palak)', category: 'Fruits & Vegetables', quantity: 'Weekly basket', price: 220, createdAt: `${currentM}-18T16:00:00` },
      { id: 'exp_9', date: `${currentM}-22`, item: 'Paneer 400g + Curd tubs', category: 'Protein', quantity: '400g + 1kg', price: 230, createdAt: `${currentM}-22T19:00:00` },
      { id: 'exp_10', date: `${currentM}-25`, item: 'Bananas & Seasonal Fruits', category: 'Fruits & Vegetables', quantity: '2 dozen', price: 140, createdAt: `${currentM}-25T08:00:00` },
    ];
  });

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() =>
    loadStorage(STORAGE_KEYS.WEIGHT_ENTRIES, INITIAL_WEIGHT_LOG)
  );

  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(() =>
    loadStorage(STORAGE_KEYS.WEEKLY_PLAN, INITIAL_WEEKLY_PLAN)
  );

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() =>
    loadStorage(STORAGE_KEYS.SHOPPING_LIST, INITIAL_SHOPPING_LIST)
  );

  const [vegetables, setVegetables] = useState<VegetableItem[]>(() =>
    loadStorage(STORAGE_KEYS.VEGETABLES, INITIAL_AFFORDABLE_VEGETABLES)
  );

  const [monthlyArchives, setMonthlyArchives] = useState<MonthlySummary[]>(() =>
    loadStorage(STORAGE_KEYS.MONTHLY_ARCHIVES, [
      {
        monthKey: '2026-07',
        monthLabel: 'July 2026',
        budget: 4500,
        totalSpent: 4180,
        averageDailySpend: 134.8,
        daysLogged: 31,
        avgDailyProtein: 87.5,
        endWeight: 55.6,
      },
    ])
  );

  // Lunch protein customizer source
  const [lunchCustomSource, setLunchCustomSource] = useState<{
    source: string;
    portionGrams: number;
    chanaGrams: number;
    curdGrams: number;
  }>({
    source: 'Soy chunks',
    portionGrams: 50,
    chanaGrams: 50,
    curdGrams: 250,
  });

  // Save changes to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => saveStorage(STORAGE_KEYS.FOOD_DB, foodDatabase), [foodDatabase]);
  useEffect(() => saveStorage(STORAGE_KEYS.LOGGED_FOODS, loggedFoods), [loggedFoods]);
  useEffect(() => saveStorage(STORAGE_KEYS.MEAL_COMPLETIONS, mealCompletions), [mealCompletions]);
  useEffect(() => saveStorage(STORAGE_KEYS.EXPENSES, expenses), [expenses]);
  useEffect(() => saveStorage(STORAGE_KEYS.WEIGHT_ENTRIES, weightEntries), [weightEntries]);
  useEffect(() => saveStorage(STORAGE_KEYS.WEEKLY_PLAN, weeklyPlan), [weeklyPlan]);
  useEffect(() => saveStorage(STORAGE_KEYS.SHOPPING_LIST, shoppingList), [shoppingList]);
  useEffect(() => saveStorage(STORAGE_KEYS.VEGETABLES, vegetables), [vegetables]);
  useEffect(() => saveStorage(STORAGE_KEYS.MONTHLY_ARCHIVES, monthlyArchives), [monthlyArchives]);

  // Derived: Today's Logged Foods
  const todayLoggedFoods = useMemo(() => {
    return loggedFoods.filter((f) => f.timestamp.startsWith(selectedDate));
  }, [loggedFoods, selectedDate]);

  // Derived: Today's Total Protein
  const todayProtein = useMemo(() => {
    const sum = todayLoggedFoods.reduce((acc, curr) => acc + curr.protein, 0);
    return Math.round(sum * 10) / 10;
  }, [todayLoggedFoods]);

  // Check confetti trigger
  useEffect(() => {
    if (todayProtein >= settings.dailyProteinTarget && settings.enableConfetti) {
      triggerProteinGoalConfetti();
    }
  }, [todayProtein, settings.dailyProteinTarget, settings.enableConfetti]);

  // Derived: Today's Protein Breakdown by Source
  const todayProteinBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {
      Eggs: 0,
      Soy: 0,
      Chana: 0,
      'Green gram': 0,
      Chicken: 0,
      Paneer: 0,
      Milk: 0,
      Curd: 0,
      Other: 0,
    };

    todayLoggedFoods.forEach((food) => {
      const nameLower = food.name.toLowerCase();
      if (nameLower.includes('egg')) breakdown.Eggs += food.protein;
      else if (nameLower.includes('soy')) breakdown.Soy += food.protein;
      else if (nameLower.includes('chana')) breakdown.Chana += food.protein;
      else if (nameLower.includes('green gram') || nameLower.includes('moong')) breakdown['Green gram'] += food.protein;
      else if (nameLower.includes('chicken')) breakdown.Chicken += food.protein;
      else if (nameLower.includes('paneer')) breakdown.Paneer += food.protein;
      else if (nameLower.includes('milk')) breakdown.Milk += food.protein;
      else if (nameLower.includes('curd') || nameLower.includes('dahi')) breakdown.Curd += food.protein;
      else breakdown.Other += food.protein;
    });

    Object.keys(breakdown).forEach((k) => {
      breakdown[k] = Math.round(breakdown[k] * 10) / 10;
    });

    return breakdown;
  }, [todayLoggedFoods]);

  // Derived: 7-day daily protein history
  const dailyProteinHistory = useMemo(() => {
    const history: { date: string; displayDate: string; protein: number; goal: number }[] = [];
    const baseDate = new Date(selectedDate + 'T00:00:00');

    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayFoods = loggedFoods.filter((f) => f.timestamp.startsWith(dateStr));
      const totalP = dayFoods.reduce((acc, curr) => acc + curr.protein, 0);

      history.push({
        date: dateStr,
        displayDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        protein: Math.round(totalP * 10) / 10,
        goal: settings.dailyProteinTarget,
      });
    }
    return history;
  }, [loggedFoods, selectedDate, settings.dailyProteinTarget]);

  // Derived: 7-day average protein
  const sevenDayAverageProtein = useMemo(() => {
    const total = dailyProteinHistory.reduce((acc, curr) => acc + curr.protein, 0);
    const count = dailyProteinHistory.length;
    return count > 0 ? Math.round((total / count) * 10) / 10 : 0;
  }, [dailyProteinHistory]);

  // Today's Meals structure
  const todayMeals = useMemo(() => {
    const completions = mealCompletions[selectedDate] || {};

    // Calculate dynamic lunch items based on selected protein source
    const lunchFood = foodDatabase.find((f) => f.name.toLowerCase().includes(lunchCustomSource.source.toLowerCase())) || foodDatabase[4];
    const curdFood = foodDatabase.find((f) => f.id === 'curd') || foodDatabase[9];
    const riceFood = foodDatabase.find((f) => f.id === 'rice') || foodDatabase[10];
    const vegFood = foodDatabase.find((f) => f.id === 'mixed_veggies') || foodDatabase[13];
    const chanaFood = foodDatabase.find((f) => f.id === 'chana') || foodDatabase[5];

    const lunchPortionMultiplier = lunchCustomSource.portionGrams / (lunchFood?.servingSize || 50);
    const lunchProtCalculated = Math.round((lunchFood.protein * lunchPortionMultiplier + 7 + 2 + 8.5 + (lunchCustomSource.chanaGrams ? 10 : 0)) * 10) / 10;
    const lunchCostCalculated = Math.round((lunchFood.price * lunchPortionMultiplier + 7 + 12 + 25 + (lunchCustomSource.chanaGrams ? 9.5 : 0)) * 10) / 10;

    const breakfast: MealSlot = {
      id: 'breakfast',
      name: 'Breakfast',
      timeLabel: '08:00 AM',
      iconName: 'Sun',
      items: [
        { foodId: 'egg', foodName: '2 Eggs', quantity: 2, protein: 12.6, cost: 16, servingUnit: 'pieces' },
        { foodId: 'muesli', foodName: '50 g Muesli', quantity: 1, protein: 5.0, cost: 38, servingUnit: '50g' },
        { foodId: 'milk', foodName: '250 ml Milk', quantity: 1, protein: 8.0, cost: 15, servingUnit: '250ml' },
        { foodId: 'banana', foodName: '1 Banana', quantity: 1, protein: 1.2, cost: 17, servingUnit: 'piece' },
      ],
      completed: !!completions.breakfast,
      totalProtein: 26.8,
      totalCost: 86.0,
    };

    const lunch: MealSlot = {
      id: 'lunch',
      name: 'Lunch',
      timeLabel: '01:30 PM',
      iconName: 'Utensils',
      proteinSource: lunchCustomSource.source,
      items: [
        { foodId: 'rice', foodName: '100 g Rice', quantity: 1, protein: 7.0, cost: 7.0, servingUnit: '100g dry' },
        { foodId: lunchFood.id, foodName: `${lunchCustomSource.portionGrams}g ${lunchFood.name}`, quantity: lunchPortionMultiplier, protein: Math.round(lunchFood.protein * lunchPortionMultiplier * 10) / 10, cost: Math.round(lunchFood.price * lunchPortionMultiplier), servingUnit: `${lunchCustomSource.portionGrams}g` },
        { foodId: 'chana', foodName: `${lunchCustomSource.chanaGrams}g Chana / Moong`, quantity: 1, protein: 10.0, cost: 9.5, servingUnit: '50g' },
        { foodId: 'mixed_veggies', foodName: 'Vegetables sabzi', quantity: 1, protein: 2.0, cost: 12.0, servingUnit: '150g' },
        { foodId: 'curd', foodName: '250 g Curd / Dahi', quantity: 1, protein: 8.5, cost: 25.0, servingUnit: '250g' },
      ],
      completed: !!completions.lunch,
      totalProtein: lunchProtCalculated,
      totalCost: lunchCostCalculated,
    };

    const dinner: MealSlot = {
      id: 'dinner',
      name: 'Dinner (Cook Once batch)',
      timeLabel: '08:30 PM',
      iconName: 'Moon',
      items: [
        { foodId: 'batch_curry', foodName: 'Same Curry (Reheated from Lunch)', quantity: 1, protein: 20.0, cost: 15.0, servingUnit: 'batch' },
        { foodId: 'rice', foodName: '100 g Rice OR 2 Chapathis', quantity: 1, protein: 7.0, cost: 7.0, servingUnit: 'serving' },
        { foodId: 'egg', foodName: '2 Boiled/Fried Eggs', quantity: 2, protein: 12.6, cost: 16.0, servingUnit: 'pieces' },
      ],
      completed: !!completions.dinner,
      totalProtein: 39.6,
      totalCost: 38.0,
    };

    return { breakfast, lunch, dinner };
  }, [mealCompletions, selectedDate, foodDatabase, lunchCustomSource]);

  const todayMealsCompletedCount = useMemo(() => {
    let count = 0;
    if (todayMeals.breakfast.completed) count++;
    if (todayMeals.lunch.completed) count++;
    if (todayMeals.dinner.completed) count++;
    return count;
  }, [todayMeals]);

  // Derived: Expenses & Budget Calculations
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const monthlySpent = useMemo(() => {
    return currentMonthExpenses.reduce((acc, curr) => acc + curr.price, 0);
  }, [currentMonthExpenses]);

  const remainingBudget = useMemo(() => {
    return settings.monthlyBudget - monthlySpent;
  }, [settings.monthlyBudget, monthlySpent]);

  const percentBudgetUsed = useMemo(() => {
    if (settings.monthlyBudget <= 0) return 0;
    return Math.min(100, Math.round((monthlySpent / settings.monthlyBudget) * 100));
  }, [monthlySpent, settings.monthlyBudget]);

  const availablePlannedFoodBudget = useMemo(() => {
    return Math.max(0, settings.monthlyBudget - settings.reservedExtrasBudget);
  }, [settings.monthlyBudget, settings.reservedExtrasBudget]);

  // Days in month calculation
  const [currYear, currMonthIndex] = useMemo(() => {
    const parts = selectedMonth.split('-');
    return [parseInt(parts[0], 10), parseInt(parts[1], 10) - 1];
  }, [selectedMonth]);

  const totalDaysInMonth = useMemo(() => {
    return getDaysInMonth(currYear, currMonthIndex);
  }, [currYear, currMonthIndex]);

  const daysElapsedInMonth = useMemo(() => {
    const today = new Date();
    const isCurrentActiveMonth = getMonthKey(today) === selectedMonth;
    if (isCurrentActiveMonth) {
      return Math.max(1, today.getDate());
    }
    return totalDaysInMonth;
  }, [selectedMonth, totalDaysInMonth]);

  const daysRemainingInMonth = useMemo(() => {
    return Math.max(1, totalDaysInMonth - daysElapsedInMonth + 1);
  }, [totalDaysInMonth, daysElapsedInMonth]);

  const averageDailySpend = useMemo(() => {
    return daysElapsedInMonth > 0 ? Math.round((monthlySpent / daysElapsedInMonth) * 10) / 10 : 0;
  }, [monthlySpent, daysElapsedInMonth]);

  const estimatedMonthEndSpend = useMemo(() => {
    return Math.round(averageDailySpend * totalDaysInMonth);
  }, [averageDailySpend, totalDaysInMonth]);

  const recommendedDailyBudgetRemaining = useMemo(() => {
    if (remainingBudget <= 0) return 0;
    return Math.round((remainingBudget / daysRemainingInMonth) * 10) / 10;
  }, [remainingBudget, daysRemainingInMonth]);

  const budgetStatus = useMemo((): 'on_track' | 'warning' | 'exceeded' => {
    if (monthlySpent > settings.monthlyBudget) return 'exceeded';
    const idealSpendByNow = (settings.monthlyBudget / totalDaysInMonth) * daysElapsedInMonth;
    if (monthlySpent > idealSpendByNow * 1.15) return 'warning';
    return 'on_track';
  }, [monthlySpent, settings.monthlyBudget, totalDaysInMonth, daysElapsedInMonth]);

  // Estimated weekly vegetable spend
  const weeklyVegetableSpendEstimate = useMemo(() => {
    return vegetables
      .filter((v) => v.purchasedThisWeek)
      .reduce((acc, curr) => acc + curr.avgPricePerKg, 0);
  }, [vegetables]);

  // Handlers
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleMealCompleted = (slotId: 'breakfast' | 'lunch' | 'dinner') => {
    const isCurrentlyDone = !!mealCompletions[selectedDate]?.[slotId];
    const nextState = !isCurrentlyDone;

    setMealCompletions((prev) => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [slotId]: nextState,
      },
    }));

    if (nextState) {
      // Auto add meal items to logged foods if not already added to avoid duplicate additions
      const meal = todayMeals[slotId];
      const newLogs: LoggedFood[] = meal.items.map((item, idx) => ({
        id: `meal_${slotId}_${Date.now()}_${idx}`,
        foodId: item.foodId,
        name: item.foodName,
        category: (foodDatabase.find((f) => f.id === item.foodId)?.category || 'Protein') as ExpenseCategory,
        quantity: item.quantity,
        servingAmountText: item.servingUnit,
        protein: item.protein,
        cost: item.cost,
        mealSlot: slotId,
        timestamp: `${selectedDate}T${slotId === 'breakfast' ? '08:30:00' : slotId === 'lunch' ? '13:30:00' : '20:30:00'}`,
      }));

      setLoggedFoods((prev) => [...prev, ...newLogs]);
    } else {
      // Remove logs linked to this meal slot for today
      setLoggedFoods((prev) =>
        prev.filter((f) => !(f.timestamp.startsWith(selectedDate) && f.mealSlot === slotId))
      );
    }
  };

  const updateLunchProteinSource = (sourceName: string, portionSizeGrams: number, chanaGrams = 50, curdGrams = 250) => {
    setLunchCustomSource({
      source: sourceName,
      portionGrams: portionSizeGrams,
      chanaGrams,
      curdGrams,
    });
  };

  const addFoodLog = (foodId: string, quantity: number, mealSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack') => {
    const food = foodDatabase.find((f) => f.id === foodId);
    if (!food) return;

    const totalProtein = Math.round(food.protein * quantity * 10) / 10;
    const totalCost = Math.round(food.price * quantity * 10) / 10;
    const amountText = `${food.servingSize * quantity} ${food.servingUnit}`;

    const newLog: LoggedFood = {
      id: `food_log_${Date.now()}`,
      foodId: food.id,
      name: food.name,
      category: food.category,
      quantity,
      servingAmountText: amountText,
      protein: totalProtein,
      cost: totalCost,
      mealSlot,
      timestamp: `${selectedDate}T${new Date().toTimeString().slice(0, 8)}`,
    };

    setLoggedFoods((prev) => [newLog, ...prev]);
  };

  const removeFoodLog = (id: string) => {
    setLoggedFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const addWeightEntry = (weight: number, dateStr = selectedDate, notes?: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const display = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const newEntry: WeightEntry = {
      id: `w_${Date.now()}`,
      date: dateStr,
      displayDate: display,
      weight: Math.round(weight * 10) / 10,
      notes,
    };

    setWeightEntries((prev) => {
      const filtered = prev.filter((w) => w.date !== dateStr);
      return [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    });

    setSettings((prev) => ({ ...prev, currentWeight: weight }));
  };

  const deleteWeightEntry = (id: string) => {
    setWeightEntries((prev) => prev.filter((w) => w.id !== id));
  };

  const updateFoodItem = (updated: FoodItem) => {
    setFoodDatabase((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...item,
      id: `custom_food_${Date.now()}`,
    };
    setFoodDatabase((prev) => [...prev, newFood]);
  };

  const deleteFoodItem = (id: string) => {
    setFoodDatabase((prev) => prev.filter((f) => f.id !== id));
  };

  const updateDayPlan = (index: number, plan: DayPlan) => {
    setWeeklyPlan((prev) => {
      const copy = [...prev];
      copy[index] = plan;
      return copy;
    });
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const convertShoppingItemToExpense = (id: string) => {
    const item = shoppingList.find((s) => s.id === id);
    if (!item || item.convertedToExpense) return;

    addExpense({
      date: selectedDate,
      item: item.name,
      category: item.category,
      quantity: item.weeklyQuantity,
      price: item.estimatedPrice,
    });

    setShoppingList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, convertedToExpense: true, checked: true } : s))
    );
  };

  const toggleVegetablePurchased = (id: string) => {
    setVegetables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, purchasedThisWeek: !v.purchasedThisWeek } : v))
    );
  };

  const resetForNewMonth = (targetMonthKey = getMonthKey()) => {
    // Archive previous month summary
    const prevMonthLabel = new Date(currYear, currMonthIndex).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    });

    const archive: MonthlySummary = {
      monthKey: selectedMonth,
      monthLabel: prevMonthLabel,
      budget: settings.monthlyBudget,
      totalSpent: monthlySpent,
      averageDailySpend,
      daysLogged: daysElapsedInMonth,
      avgDailyProtein: sevenDayAverageProtein,
      endWeight: settings.currentWeight,
    };

    setMonthlyArchives((prev) => [archive, ...prev.filter((a) => a.monthKey !== selectedMonth)]);
    setSelectedMonth(targetMonthKey);
    setSelectedDate(getTodayDateString());
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        selectedMonth,
        setSelectedMonth,
        settings,
        updateSettings,
        foodDatabase,
        updateFoodItem,
        addFoodItem,
        deleteFoodItem,
        todayMeals,
        toggleMealCompleted,
        updateLunchProteinSource,
        loggedFoods,
        todayLoggedFoods,
        addFoodLog,
        removeFoodLog,
        expenses,
        currentMonthExpenses,
        addExpense,
        removeExpense,
        updateExpense,
        monthlySpent,
        remainingBudget,
        percentBudgetUsed,
        averageDailySpend,
        estimatedMonthEndSpend,
        recommendedDailyBudgetRemaining,
        budgetStatus,
        availablePlannedFoodBudget,
        todayProtein,
        todayProteinBreakdown,
        sevenDayAverageProtein,
        dailyProteinHistory,
        todayMealsCompletedCount,
        weightEntries,
        addWeightEntry,
        deleteWeightEntry,
        weeklyPlan,
        updateDayPlan,
        shoppingList,
        toggleShoppingItem,
        convertShoppingItemToExpense,
        vegetables,
        toggleVegetablePurchased,
        weeklyVegetableSpendEstimate,
        monthlyArchives,
        resetForNewMonth,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isLogWeightOpen,
        setIsLogWeightOpen,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
