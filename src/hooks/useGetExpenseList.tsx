import type { expense } from "@/types/expense";
import { useState } from "react";
import { useAuthFetch } from "./useAuthFetch";

export const useGetExpenseList = () => {
  const [expenses, setExpenses] = useState<expense[]>([]);
  const { authFetch, fetchStatus, errorMessage } = useAuthFetch();

  const fetchExpenseList = async () => {
    const res = await authFetch(`${import.meta.env.VITE_EXPENSES_API_URL}`);
    if (!res) return;
    const data = await res.json();
    setExpenses(data);
  };

  return { fetchStatus, errorMessage, expenses, fetchExpenseList };
};
