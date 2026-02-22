import { Button, HStack, Icon, Text } from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";

export const IncomeFormAction = () => {
  return (
    <HStack gap={4} pt={4}>
      <Button
        type="submit"
        bg="linear-gradient(135deg, #38a169 0%, #276749 100%)"
        color="white"
        size="lg"
        flex={1}
        _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
        transition="all 0.2s"
      >
        <HStack gap={2}>
          <Icon>
            <FaPlusCircle />
          </Icon>
          <Text>登録する</Text>
        </HStack>
      </Button>
    </HStack>
  );
};
