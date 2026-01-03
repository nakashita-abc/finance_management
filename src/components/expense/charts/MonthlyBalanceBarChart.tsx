import { ChartCard } from "@/components/ui/cards/ChartCard"
import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

export const MonthlyBalanceBarChart = () => {
    const chart = {
        items: [
            { yearMonth: "2024-12", balanceAmount: -2000 },
            { yearMonth: "2025-01", balanceAmount: -1000 },
            { yearMonth: "2025-02", balanceAmount: 2000 },
            { yearMonth: "2025-03", balanceAmount: 1500 },
            { yearMonth: "2025-04", balanceAmount: -10000 },
            { yearMonth: "2025-05", balanceAmount: 30000 },
            { yearMonth: "2025-06", balanceAmount: -1000 },
            { yearMonth: "2025-07", balanceAmount: 3000 },
        ]
    }
    const barChart = useChart({
        data: chart.items,
        series: [{ name: "balanceAmount", color: "teal.solid" }],
    })
    return (
        <ChartCard title="月別収支">
            <Chart.Root maxH="sm" chart={barChart}>
                <BarChart data={barChart.data} margin={{ top: 30 }}>
                    <CartesianGrid stroke={barChart.color("border.muted")} vertical={false} />
                    <XAxis
                        dataKey="yearMonth"
                        tickFormatter={(v)=>v.slice(-2)+"月"} />
                    <YAxis />
                    {barChart.series.map((item) => (
                        <Bar
                            isAnimationActive={true}
                            key={item.name}
                            radius={4}
                            dataKey={barChart.key(item.name)}
                        >
                            <LabelList
                                position="bottom"
                                dataKey={barChart.key("balanceAmount")}
                                offset={10}
                                style={{ fontWeight: "500" }}
                            />
                            {barChart.data.map((item) => (
                                <Cell
                                    key={item.balanceAmount}
                                    fill={barChart.color(item.balanceAmount > 0 ? "green.solid" : "red.solid")}
                                />
                            ))}
                        </Bar>
                    ))}
                </BarChart>
            </Chart.Root>
        </ChartCard>
    )
}