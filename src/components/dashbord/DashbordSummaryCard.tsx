import { Card, HStack, Icon, Text } from "@chakra-ui/react";

type Props = {
  title: string;
  value: string;
  icon?: React.ReactNode;
};

export const DashbordSummaryCard = (props: Props) => {
  return (
    <Card.Root
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      color="white"
      shadow="lg"
      _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
      transition="all 0.3s"
    >
      <Card.Body>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm" opacity={0.9}>
            {props.title}
          </Text>
          <Icon fontSize="2xl" opacity={0.8}>
            {props.icon}
          </Icon>
        </HStack>
        <Text fontSize="3xl" fontWeight="bold">
          {props.value}
        </Text>
      </Card.Body>
    </Card.Root>
  );
};
