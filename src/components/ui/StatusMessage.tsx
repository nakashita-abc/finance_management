import { Box, HStack, Icon, Text, CloseButton } from "@chakra-ui/react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type Props = {
  status: "success" | "error";
  message: string;
  onClose?: () => void;
};

const config = {
  success: {
    bg: "green.50",
    borderColor: "green.400",
    color: "green.700",
    icon: FaCheckCircle,
    iconColor: "green.500",
  },
  error: {
    bg: "red.50",
    borderColor: "red.400",
    color: "red.700",
    icon: FaExclamationTriangle,
    iconColor: "red.500",
  },
};

export const StatusMessage = ({ status, message, onClose }: Props) => {
  const style = config[status];

  return (
    <Box
      bg={style.bg}
      border="1px solid"
      borderColor={style.borderColor}
      borderRadius="lg"
      p={4}
      animation="fadeIn 0.3s ease-in-out"
    >
      <HStack gap={3}>
        <Icon color={style.iconColor} fontSize="lg">
          <style.icon />
        </Icon>
        <Text color={style.color} fontSize="sm" flex={1}>
          {message}
        </Text>
        {onClose && (
          <CloseButton size="sm" onClick={onClose} color={style.color} />
        )}
      </HStack>
    </Box>
  );
};
