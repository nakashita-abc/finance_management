import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export const LoadingSpinner = () => {
  return (
    <Center py={12}>
      <VStack gap={4}>
        <Spinner size="xl" color="purple.600" borderWidth="4px" />
        <Text color="gray.500" fontSize="sm">
          読み込み中...
        </Text>
      </VStack>
    </Center>
  );
};
