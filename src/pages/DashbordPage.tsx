import { Container, SimpleGrid } from "@chakra-ui/react";
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
} from "chart.js";
import { FaWallet, FaChartLine, FaMoneyBillWave } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { DashbordSummaryCard } from "@/components/dashbord/DashbordSummaryCard";
import { DashbordHeader } from "@/components/dashbord/DashbordHeader";
import { DoughnutChart } from "@/components/dashbord/charts/DoughnutChart";
import { LineChart } from "@/components/dashbord/charts/LineChart";

// Chart.jsの登録
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type DashboardResponse = {
  summary: {
    expenseTotal: number;
    incomeTotal: number;
    incomeExpenseDiff: number;
  };
  charts: {
    categoryExpenses: { category: string; amount: number }[];
    monthlyTrend: {
      yearMonth: string;
      expenseTotal: number;
      incomeTotal: number;
      incomeExpenseDiff: number;
    }[];
  };
};

export const DashboardPage = () => {
  const auth = useAuth();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = auth.user?.id_token;
      const res = await fetch(
        import.meta.env.VITE_DASHBORD_API_URL as string,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setDashboard(data);
    };

    if (!auth.isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      fetchDashboardData();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("予期しないエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated]);

  const totalExpense: number = dashboard?.summary.expenseTotal || 0;
  const totalIncome: number = dashboard?.summary.incomeTotal || 0;
  const incomeExpenseDiff: number = dashboard?.summary.incomeExpenseDiff || 0;
  const currentMonth: string = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });

  // カテゴリ別データ
  const CATEGORY_COLORS = [
    "#3B82F6", // 青
    "#10B981", // 緑
    "#A855F7", // 紫
    "#EC4899", // ピンク
    "#06B6D4", // シアン
    "#EF4444", // 赤
    "#14B8A6", // ティール
    "#F59E0B", // 黄
  ];

  const categoryExpenses = dashboard?.charts.categoryExpenses ?? [];
  const categoryData = {
    labels: categoryExpenses.map((c) => c.category),
    datasets: [
      {
        data: categoryExpenses.map((c) => c.amount),
        backgroundColor: CATEGORY_COLORS,
        borderWidth: 0,
      },
    ],
  };
  console.log("categoryData:", categoryData);

  const monthlyTrend = dashboard?.charts.monthlyTrend ?? [];
  const monthlyData = {
    labels: monthlyTrend.map((m) => {
      const month = parseInt(m.yearMonth.split("-")[1], 10);
      return `${month}月`;
    }),
    datasets: [
      {
        label: "支出",
        data: monthlyTrend.map((m) => m.expenseTotal),
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "収入",
        data: monthlyTrend.map((m) => m.incomeTotal),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };
  console.log("monthlyData:", monthlyData);

  return (
    <Container maxW="container.xl" py={8}>
      <DashbordHeader currentMonth={currentMonth} />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <DashbordSummaryCard
          title="今月の支出"
          value={"¥" + totalExpense.toLocaleString()}
          icon={<FaMoneyBillWave />}
        />
        <DashbordSummaryCard
          title="月の収入"
          value={"¥" + totalIncome.toLocaleString()}
          icon={<FaWallet />}
        />
        <DashbordSummaryCard
          title="収支差額"
          value={"¥" + incomeExpenseDiff.toLocaleString()}
          icon={<FaChartLine />}
        />
        <DashbordSummaryCard
          title="予算使用率"
          value={
            totalIncome > 0
              ? Math.round((totalExpense / totalIncome) * 100) + "%"
              : "0%"
          }
          icon={<FaChartLine />}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <DoughnutChart categoryData={categoryData} />
        <LineChart data={monthlyData} />
      </SimpleGrid>
    </Container>
  );
};
