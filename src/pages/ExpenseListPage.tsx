import { ExpenseList } from "@/components/expense/ExpenseList";
import { ExpenseListHeader } from "@/components/expense/ExpenseListHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useGetExpenseList } from "@/hooks/useGetExpenseList";
import { Container } from "@chakra-ui/react";
import { useEffect } from "react";

export const ExpenseListPage = () => {
  const { fetchStatus, errorMessage, expenses, fetchExpenseList } =
    useGetExpenseList();

  useEffect(() => {
    fetchExpenseList();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <ExpenseListHeader />
      {fetchStatus === "error" && (
        <StatusMessage status="error" message={errorMessage} />
      )}
      <ExpenseList expenses={expenses} />
      {fetchStatus === "loading" && <LoadingSpinner />}
    </Container>
  );
};
