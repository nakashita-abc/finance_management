import type { income } from "@/types/income";
import { useAuthFetch } from "./useAuthFetch";

export const useCreateIncome = () => {
  const { authFetch, fetchStatus, setFetchStatus, errorMessage } = useAuthFetch();

  const createIncome = async (data: income) => {
    const occurredAt = new Date(data.date).toISOString();
    const res = await authFetch(
      `${import.meta.env.VITE_EXPENSE_API_URL}/income/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          occurredAt,
          category: data.category,
          amount: Number(data.amount),
          memo: data.memo || undefined,
        }),
      },
    );
    if (!res) return;
    return res.json();
  };

  return {
    createIncome,
    fetchStatus,
    setFetchStatus,
    errorMessage,
  };
};
