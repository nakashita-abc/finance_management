export type CategoryExpense = {
  category: string;
  amount: number;
};

export type MonthlyTrend = {
  yearMonth: string;
  expenseTotal: number;
  incomeTotal: number;
  incomeExpenseDiff: number;
};

export type DashboardSummary = {
  expenseTotal: number;
  incomeTotal: number;
  incomeExpenseDiff: number;
};

export type DashboardResponse = {
  summary: DashboardSummary;
  charts: {
    categoryExpenses: CategoryExpense[];
    monthlyTrend: MonthlyTrend[];
  };
};
