import { ChartCard } from "@/components/ui/cards/ChartCard"
import { useEffect } from "react"
import { Cell, Pie, PieChart, Tooltip } from "recharts"

export const CategoryPieChart = () => {
  useEffect(() => {
    fetch("https://9vnts8haqd.execute-api.us-east-1.amazonaws.com/dashboard/getMonthlyCategorySummary")
      .then((res) => res.json())
      .then((data) => console.log("response data;", data))
  }, [])
  const resCategoryData = {
    yearMonth: "2025-01",
    totalAmount: 20000,
    categories: [
      { name: "食費", amount: 3200 },
      { name: "交通費", amount: 480 },
      { name: "交際費", amount: 980 },
      { name: "日用品", amount: 1250 },
      { name: "娯楽", amount: 1900 },
      { name: "通信費", amount: 6800 },
      { name: "電気・水道・ガス", amount: 2100 }
    ]
  }

  const COLORS = [
    "#0088FE", // 食費
    "#00C49F", // 交通費
    "#FFBB28", // 交際費
    "#FF8042", // 日用品
    "#A28AFF", // 娯楽
    "#FF6699", // 通信費
    "#66CCFF"  // 電気・水道・ガス
  ];

  return (
    <ChartCard title="今月の集計">
      <PieChart width={400} height={400}>
        <Pie
          data={resCategoryData.categories}
          dataKey="amount"
          isAnimationActive={true}
          label
        >
          {resCategoryData.categories.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip defaultIndex={2} />
        {/* <RechartsDevtools /> */}
      </PieChart>
    </ChartCard>
  )
}