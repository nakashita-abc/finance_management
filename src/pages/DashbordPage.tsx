import { CategoryPieChart } from "@/components/expense/charts/CategoryPieChart"
import { MonthlyBalanceBarChart } from "@/components/expense/charts/MonthlyBalanceBarChart"
import { Box,Card} from "@chakra-ui/react"

//今月の合計
//カテゴリ別グラフ
//残り予算
//（最近の支出5件）
export const DashboardPage = () => {

  

  
  //TODO:カード、グラフをコンポーネント化
  return (
    <Box>
      <Card.Root>
        <Card.Body gap="2">
          <Card.Title mb="2">10000円</Card.Title>
          <Card.Description>
            今月の合計
          </Card.Description>
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body gap="2">
          <Card.Title mb="2">10000円</Card.Title>
          <Card.Description>
            予算
          </Card.Description>
        </Card.Body>
      </Card.Root>

      <CategoryPieChart/>
      <MonthlyBalanceBarChart/>
      
    </Box>
  )
}