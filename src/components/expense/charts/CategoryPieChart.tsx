import { ChartCard } from "@/components/ui/cards/ChartCard"
import { Chart, useChart } from "@chakra-ui/charts"
import { Cell, Pie, PieChart } from "recharts"

export const CategoryPieChart = () => {
    const resCategoryData = {
        yearMonth: "2025-01",
        totalAmount: 20000,
        categories: [
          { category: "食費", amount: 3200 },
          { category: "交通費", amount: 480 },
          { category: "交際費", amount: 980 },
          { category: "日用品", amount: 1250 },
          { category: "娯楽", amount: 1900 },
          { category: "通信費", amount: 6800 },
          { category: "電気・水道・ガス", amount: 2100 }
        ]
      }
    
      const CATEGORY_COLORS: Record<string, string> = {
        "食費": "#3182ce",
        "交通費": "#dd6b20",
        "交際費": "#d53f8c",
        "日用品": "#38a169",
        "娯楽": "#e53e3e",
        "通信費": "#805ad5",
        "電気・水道・ガス": "#ecc94b",
      }
    
      const categoryChartData = resCategoryData.categories.map((data,index) => ({
        id:index+1,
        ...data,
        color: CATEGORY_COLORS[data.category] ?? "#718096"
      }))
      const chart = useChart({
        data: categoryChartData,
      })
    
    return (
        <ChartCard title="今月の集計">
            <Chart.Root boxSize="200px" mx="auto" chart={chart} m={20}>
                <PieChart>
                    <Pie
                        isAnimationActive={true}
                        data={chart.data}
                        dataKey={chart.key("id")}
                        outerRadius={100}
                        innerRadius={0}
                        labelLine={true}
                        label={({ name, index }) => {
                            const { amount } = chart.data[index ?? -1]
                            return `${name}: ${amount}円`
                        }}
                        nameKey="category"
                    >
                        {chart.data.map((item) => (
                            <Cell key={item.category} fill={chart.color(item.color)} />
                        ))}
                    </Pie>
                </PieChart>
            </Chart.Root>
        </ChartCard>
    )
}