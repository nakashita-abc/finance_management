import type { expense } from "@/types/expense";
import { Table, Badge, Box, Text, HStack, Button } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  expenses: expense[];
};

export const ExpenseList = (props: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(props.expenses.map((e) => e.category))];

  const filteredExpenses = selectedCategory
    ? props.expenses.filter((e) => e.category === selectedCategory)
    : props.expenses;

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <Box>
      <Box mb={4}>
        <Text fontSize="sm" color="gray.600" mb={2} fontWeight="medium">
          カテゴリで絞り込み
        </Text>
        <HStack gap={2} flexWrap="wrap">
          <Button
            size="sm"
            variant={selectedCategory === null ? "solid" : "outline"}
            bg={selectedCategory === null ? "purple.600" : "transparent"}
            color={selectedCategory === null ? "white" : "gray.600"}
            borderColor="gray.300"
            _hover={{
              bg: selectedCategory === null ? "purple.700" : "gray.100",
            }}
            onClick={() => setSelectedCategory(null)}
          >
            すべて
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "solid" : "outline"}
              bg={selectedCategory === category ? "purple.600" : "transparent"}
              color={selectedCategory === category ? "white" : "gray.600"}
              borderColor="gray.300"
              _hover={{
              bg: selectedCategory === category ? "purple.700" : "gray.100",
            }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </HStack>
      </Box>

      <Box
        mb={4}
        p={4}
        bg="purple.50"
        borderRadius="md"
        borderWidth="1px"
        borderColor="purple.200"
      >
        <Text fontSize="sm" color="gray.600" mb={1}>
          {selectedCategory ? `${selectedCategory}の合計` : "合計支出"}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="purple.600">
          ¥{totalAmount.toLocaleString()}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {filteredExpenses.length}件の支出
        </Text>
      </Box>

      <Table.ScrollArea borderWidth="1px" rounded="md" maxH="600px">
        <Table.Root size="md" variant="outline" striped stickyHeader>
          <Table.Header>
            <Table.Row bg="white" boxShadow="sm">
              <Table.ColumnHeader width="120px" bg="gray.100" fontWeight="bold">
                日付
              </Table.ColumnHeader>
              <Table.ColumnHeader width="120px" bg="gray.100" fontWeight="bold">
                カテゴリ
              </Table.ColumnHeader>
              <Table.ColumnHeader bg="gray.100" fontWeight="bold">
                説明
              </Table.ColumnHeader>
              <Table.ColumnHeader
                width="140px"
                textAlign="end"
                bg="gray.100"
                fontWeight="bold"
              >
                金額
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredExpenses.map((item, index) => (
              <Table.Row
                key={index}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="background 0.2s"
              >
                <Table.Cell fontWeight="medium" color="gray.700">
                  {item.date}
                </Table.Cell>
                <Table.Cell>
                  <Badge size="sm">{item.category}</Badge>
                </Table.Cell>
                <Table.Cell color="gray.600">{item.title}</Table.Cell>
                <Table.Cell
                  textAlign="end"
                  fontWeight="semibold"
                  fontSize="lg"
                  color="gray.800"
                >
                  ¥{item.amount.toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};
