import type { expense } from "@/types/expense";
import { useAuthFetch } from "./useAuthFetch";

export const useCreateExpense = () => {
  const { authFetch, fetchStatus, setFetchStatus, errorMessage } = useAuthFetch();

  const createExpense = async (data: expense) => {
    const occurredAt = new Date(data.date).toISOString();
    const res = await authFetch(
      `${import.meta.env.VITE_EXPENSE_API_URL}/expense/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occurredAt,
          category: data.category,
          amount: Number(data.amount),
          note: data.title || undefined,
        }),
      },
    );
    if (!res) return;
    return res.json();
  };

  return {
    createExpense,
    fetchStatus,
    setFetchStatus,
    errorMessage,
  };
};
