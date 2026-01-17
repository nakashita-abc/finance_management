import { Box, Container, SimpleGrid, Text, Card, Heading, HStack, Icon } from "@chakra-ui/react"
import { Doughnut, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { FaWallet, FaChartLine, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa"

// Chart.jsの登録
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const DashboardPage = () => {
  // モックデータ
  const totalExpense = 24710
  const budget = 50000
  const remainingBudget = budget - totalExpense
  const currentMonth = "2025年1月"

  // カテゴリ別データ
  const categoryData = {
    labels: ["食費", "交通費", "日用品", "娯楽", "通信費", "医療費", "衣服", "交際費"],
    datasets: [
      {
        data: [3760, 480, 1250, 1900, 6800, 2100, 2980, 4500],
        backgroundColor: [
          "#3B82F6", // 青
          "#10B981", // 緑
          "#A855F7", // 紫
          "#EC4899", // ピンク
          "#06B6D4", // シアン
          "#EF4444", // 赤
          "#14B8A6", // ティール
          "#F59E0B", // 黄
        ],
        borderWidth: 0,
      },
    ],
  }

  // 月次推移データ
  const monthlyData = {
    labels: ["9月", "10月", "11月", "12月", "1月"],
    datasets: [
      {
        label: "支出",
        data: [32000, 28500, 31200, 29800, 24710],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "予算",
        data: [50000, 50000, 50000, 50000, 50000],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ""
            const value = context.parsed || 0
            return `${label}: ¥${value.toLocaleString()}`
          },
        },
      },
    },
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || ""
            const value = context.parsed.y || 0
            return `${label}: ¥${value.toLocaleString()}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return "¥" + value.toLocaleString()
          },
        },
      },
    },
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* 月表示 */}
      <HStack mb={6} justify="space-between" align="center">
        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
          ダッシュボード
        </Heading>
        <HStack gap={2} color="purple.600">
          <Icon fontSize="xl">
            <FaCalendarAlt />
          </Icon>
          <Text fontSize="lg" fontWeight="semibold">
            {currentMonth}
          </Text>
        </HStack>
      </HStack>

      {/* サマリーカード */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        {/* 今月の支出 */}
        <Card.Root bg="gradient-to-br from-purple-500 to-purple-600" color="white">
          <Card.Body>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" opacity={0.9}>
                今月の支出
              </Text>
              <Icon fontSize="2xl" opacity={0.8}>
                <FaMoneyBillWave />
              </Icon>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              ¥{totalExpense.toLocaleString()}
            </Text>
          </Card.Body>
        </Card.Root>

        {/* 予算 */}
        <Card.Root bg="gradient-to-br from-blue-500 to-blue-600" color="white">
          <Card.Body>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" opacity={0.9}>
                月予算
              </Text>
              <Icon fontSize="2xl" opacity={0.8}>
                <FaWallet />
              </Icon>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              ¥{budget.toLocaleString()}
            </Text>
          </Card.Body>
        </Card.Root>

        {/* 残り予算 */}
        <Card.Root bg="gradient-to-br from-green-500 to-green-600" color="white">
          <Card.Body>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" opacity={0.9}>
                残り予算
              </Text>
              <Icon fontSize="2xl" opacity={0.8}>
                <FaChartLine />
              </Icon>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              ¥{remainingBudget.toLocaleString()}
            </Text>
          </Card.Body>
        </Card.Root>

        {/* 予算達成率 */}
        <Card.Root bg="gradient-to-br from-orange-500 to-orange-600" color="white">
          <Card.Body>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" opacity={0.9}>
                予算使用率
              </Text>
              <Icon fontSize="2xl" opacity={0.8}>
                <FaChartLine />
              </Icon>
            </HStack>
            <Text fontSize="3xl" fontWeight="bold">
              {Math.round((totalExpense / budget) * 100)}%
            </Text>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      {/* グラフエリア */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        {/* カテゴリ別円グラフ */}
        <Card.Root>
          <Card.Body>
            <Card.Title mb={4} fontSize="xl" color="gray.800">
              カテゴリ別支出
            </Card.Title>
            <Box h="350px">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </Box>
          </Card.Body>
        </Card.Root>

        {/* 月次推移グラフ */}
        <Card.Root>
          <Card.Body>
            <Card.Title mb={4} fontSize="xl" color="gray.800">
              月次推移
            </Card.Title>
            <Box h="350px">
              <Line data={monthlyData} options={lineOptions} />
            </Box>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Container>
  )
}