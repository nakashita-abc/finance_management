import { Chart, useChart } from "@chakra-ui/charts"
import { Box } from "@chakra-ui/react"
import { Cell, Pie, PieChart } from "recharts"

export const DashboardPage=()=>{
    const chart = useChart({
    data: [
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
    ],
  })
  //TODO:カテゴリごとに色を割り当てる
  return (
    <Box>
    <p>今月の合計・残り予算</p><br/>
    <Chart.Root boxSize="200px" mx="auto" chart={chart}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key("id")}
          outerRadius={100}
          innerRadius={0}
          labelLine={false}
          label={({ name, index }) => {
            const { id } = chart.data[index ?? -1]
            const percent = id / chart.getTotal("id")
            return `${name}: ${(percent * 100).toFixed(1)}%`
          }}
        >
          {chart.data.map((item) => {
            return <Cell key={item.category} />
          })}
        </Pie>
      </PieChart>
    </Chart.Root><br/>
    <p>直近五件の支出一覧</p>
    </Box>
  )
}