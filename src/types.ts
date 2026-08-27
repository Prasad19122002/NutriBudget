export type TabType = 'dashboard' | 'meals' | 'budget' | 'plan' | 'progress';

export type ExpenseCategory = 'Protein' | 'Carbohydrates' | 'Fruits & Vegetables' | 'Cooking & Extras';

export interface FoodItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  servingSize: number;
  servingUnit: string;
  price: number; // in INR ₹
  protein: number; // in grams
  isDefault?: boolean;
  icon?: string;
}

export interface MealItemPortion {
  foodId: string;
  foodName: string;
  quantity: number; // multiplier of standard serving
  protein: number; // calculated
  cost: number; // calculated
  servingUnit: string;
  notes?: string;
}

export interface MealSlot {
  id: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  timeLabel: string;
  iconName: string;
  items: MealItemPortion[];
  completed: boolean;
  completedAt?: string;
  totalProtein: number;
  totalCost: number;
  proteinSource?: string; // for lunch customizer (e.g. 'Soy chunks', 'Chicken', etc.)
}

export interface LoggedFood {
  id: string;
  foodId: string;
  name: string;
  category: ExpenseCategory;
  quantity: number; // multiplier of standard serving
  servingAmountText: string;
  protein: number;
  cost: number;
  mealSlot?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string; // ISO string
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  item: string;
  category: ExpenseCategory;
  quantity: string;
  price: number;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  displayDate: string;
  weight: number; // in kg
  notes?: string;
}

export interface DayPlan {
  dayName: string; // 'Monday', 'Tuesday', etc.
  dayShort: string; // 'Mon', 'Tue', etc.
  breakfast: {
    title: string;
    items: string[];
    estProtein: number;
    estCost: number;
  };
  lunch: {
    title: string;
    items: string[];
    proteinSource: string;
    estProtein: number;
    estCost: number;
  };
  dinner: {
    title: string;
    items: string[];
    cookOnceRef: string;
    estProtein: number;
    estCost: number;
  };
  totalProtein: number;
  totalCost: number;
}

export interface VegetableItem {
  id: string;
  name: string;
  hindiName?: string;
  avgPricePerKg: number;
  purchasedThisWeek: boolean;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  weeklyQuantity: string;
  estimatedPrice: number;
  checked: boolean;
  convertedToExpense?: boolean;
}

export interface CookOnceRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: { name: string; amount: string; estCost: number; protein: number }[];
  lunchPortion: string;
  dinnerPortion: string;
  totalProtein: number;
  totalCost: number;
  workFriendlyTip: string;
}

export interface UserSettings {
  monthlyBudget: number; // ₹4500
  reservedExtrasBudget: number; // ₹450
  dailyProteinTarget: number; // 90
  startingWeight: number; // 56.0
  currentWeight: number; // 56.0
  userAge: number; // 23
  currencySymbol: string; // '₹'
  enableConfetti: boolean;
}

export interface MonthlySummary {
  monthKey: string; // e.g. '2026-08'
  monthLabel: string; // e.g. 'August 2026'
  budget: number;
  totalSpent: number;
  averageDailySpend: number;
  daysLogged: number;
  avgDailyProtein: number;
  endWeight: number;
}
