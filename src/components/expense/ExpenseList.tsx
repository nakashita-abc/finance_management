import { IconButton, Table, Badge, Box, Text, HStack, Button } from "@chakra-ui/react"
import { IoMdCreate } from "react-icons/io"
import { TfiClose } from "react-icons/tfi"
import { useState } from "react"

// カテゴリごとの色
const CATEGORY_COLORS: Record<string, string> = {
  食費: "blue",
  交通費: "green",
  外食: "orange",
  日用品: "purple",
  娯楽: "pink",
  通信費: "cyan",
  医療費: "red",
  衣服: "teal",
  交際費: "yellow",
  "電気・水道・ガス": "gray",
}

// ロジックは呼び出しもとで行う
export const ExpenseList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const expenses = [
    { id: 1, date: "2025-01-05", category: "食費", description: "スーパーで食材購入", amount: 3200 },
    { id: 2, date: "2025-01-06", category: "交通費", description: "電車代", amount: 480 },
    { id: 3, date: "2025-01-07", category: "外食", description: "ランチ代", amount: 980 },
    { id: 4, date: "2025-01-08", category: "日用品", description: "洗剤・ティッシュ", amount: 1250 },
    { id: 5, date: "2025-01-09", category: "娯楽", description: "映画鑑賞", amount: 1900 },
    { id: 6, date: "2025-01-10", category: "通信費", description: "スマホ料金", amount: 6800 },
    { id: 7, date: "2025-01-11", category: "医療費", description: "病院代", amount: 2100 },
    { id: 8, date: "2025-01-12", category: "食費", description: "コンビニ", amount: 560 },
    { id: 9, date: "2025-01-13", category: "衣服", description: "Tシャツ購入", amount: 2980 },
    { id: 10, date: "2025-01-14", category: "交際費", description: "飲み会", amount: 4500 },
  ]

  // ユニークなカテゴリを取得
  const categories = [...new Set(expenses.map((e) => e.category))]

  // フィルタリング
  const filteredExpenses = selectedCategory
    ? expenses.filter((e) => e.category === selectedCategory)
    : expenses

  const handleEdit = (id: number) => {
    alert("API未実装です")
    console.log("編集ID:", id)
  }

  const handleDelete = (id: number) => {
    // API未実装
    alert(`ID: ${id} の支出を削除します（API未実装）`)
  }

  // 合計金額を計算
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Box>
      {/* カテゴリフィルター */}
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
              colorScheme={CATEGORY_COLORS[category] || "gray"}
              bg={selectedCategory === category ? undefined : "transparent"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* 合計金額表示 */}
      <Box mb={4} p={4} bg="purple.50" borderRadius="md" borderWidth="1px" borderColor="purple.200">
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

      {/* テーブル */}
      <Table.ScrollArea borderWidth="1px" rounded="md" maxH="600px">
        <Table.Root size="md" variant="outline" striped stickyHeader>
          <Table.Header>
            <Table.Row bg="white" boxShadow="sm">
              <Table.ColumnHeader width="120px" bg="gray.100" fontWeight="bold">日付</Table.ColumnHeader>
              <Table.ColumnHeader width="120px" bg="gray.100" fontWeight="bold">カテゴリ</Table.ColumnHeader>
              <Table.ColumnHeader bg="gray.100" fontWeight="bold">説明</Table.ColumnHeader>
              <Table.ColumnHeader width="140px" textAlign="end" bg="gray.100" fontWeight="bold">
                金額
              </Table.ColumnHeader>
              <Table.ColumnHeader width="100px" textAlign="center" bg="gray.100" fontWeight="bold">
                操作
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredExpenses.map((item) => (
              <Table.Row
                key={item.id}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="background 0.2s"
              >
                <Table.Cell fontWeight="medium" color="gray.700">
                  {item.date}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorScheme={CATEGORY_COLORS[item.category] || "gray"} size="sm">
                    {item.category}
                  </Badge>
                </Table.Cell>
                <Table.Cell color="gray.600">{item.description}</Table.Cell>
                <Table.Cell textAlign="end" fontWeight="semibold" fontSize="lg" color="gray.800">
                  ¥{item.amount.toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Box display="flex" gap={2} justifyContent="center">
                    <IconButton
                      aria-label="編集"
                      size="sm"
                      bg="blue.500"
                      color="white"
                      _hover={{ bg: "blue.600" }}
                      onClick={() => handleEdit(item.id)}
                    >
                      <IoMdCreate />
                    </IconButton>
                    <IconButton
                      aria-label="削除"
                      size="sm"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: "red.600" }}
                      onClick={() => handleDelete(item.id)}
                    >
                      <TfiClose />
                    </IconButton>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  )
}