import { Box, Heading, HStack, Icon, VStack } from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";

export const ExpenseFormHeader = () => {
  return (
    <HStack gap={4}>
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        borderRadius="full"
        p={3}
      >
        <Icon fontSize="2xl" color="white">
          <FaPlusCircle />
        </Icon>
      </Box>
      <VStack align="start" gap={0}>
        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
          支出登録
        </Heading>
      </VStack>
    </HStack>
  );
};
