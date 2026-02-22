import { Box, Container, VStack } from "@chakra-ui/react";
import { IncomeForm } from "@/components/income/IncomeForm";
import { IncomeFormHeader } from "@/components/income/IncomeFormHeader";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useCreateIncome } from "@/hooks/useCreateIncome";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const CreateIncomePage = () => {
  const { createIncome, fetchStatus, setFetchStatus, errorMessage } = useCreateIncome();

  return (
    <Box bg="gray.50" minH="calc(100vh - 70px)">
      <Container maxW="container.md" py={8}>
        <VStack gap={6} align="stretch">
          <IncomeFormHeader />
          {fetchStatus === "success" && (
            <StatusMessage
              status="success"
              message="収入を登録しました"
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
          <IncomeForm createIncome={createIncome} />
          {fetchStatus === "loading" && <LoadingSpinner />}
        </VStack>
      </Container>
    </Box>
  );
};