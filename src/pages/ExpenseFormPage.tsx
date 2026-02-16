import { Box, Container, VStack } from "@chakra-ui/react";
import { ExpenseForm } from "@/components/expense/ExpenseForm";
import { ExpenseFormHeader } from "@/components/expense/ExpenseFormHeader";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useCreateExpense } from "@/hooks/useCreateExpense";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const ExpenseFormPage = () => {
  const { createExpense, fetchStatus,setFetchStatus, errorMessage } = useCreateExpense();

  return (
    <Box bg="gray.50" minH="calc(100vh - 70px)">
      <Container maxW="container.md" py={8}>
        <VStack gap={6} align="stretch">
          <ExpenseFormHeader />
          {fetchStatus === "success" && (
            <StatusMessage
              status="success"
              message="支出を登録しました"
              onClose={() => setFetchStatus("idle")}
            />
          )}
          {fetchStatus === "error" && (
            <StatusMessage
              status="error"
              message={errorMessage}
              onClose={() => setFetchStatus("idle")}
            />
          )}
          <ExpenseForm createExpense={createExpense} />
          {fetchStatus === "loading" && <LoadingSpinner />}
        </VStack>
      </Container>
    </Box>
  );
};
