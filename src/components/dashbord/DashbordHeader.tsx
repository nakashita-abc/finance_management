import { Heading, HStack, Icon, Text } from "@chakra-ui/react";
import { FaCalendarAlt } from "react-icons/fa";

type Props = {
  currentMonth: string;
};
export const DashbordHeader = (props: Props) => {
  return (
    <HStack mb={6} justify="space-between" align="center">
      <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
        ダッシュボード
      </Heading>
      <HStack gap={2} color="purple.600">
        <Icon fontSize="xl">
          <FaCalendarAlt />
        </Icon>
        <Text fontSize="lg" fontWeight="semibold">
          {props.currentMonth}
        </Text>
      </HStack>
    </HStack>
  );
};
