import { IconButton, Table } from "@chakra-ui/react"
import { IoMdCreate } from "react-icons/io";
import { TfiClose } from "react-icons/tfi";

// ロジックは呼び出しもとで行う
export const ExpenseList = () => {
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
    ];

    return (
        <Table.ScrollArea borderWidth="1px" rounded="md" height="500px">
            <Table.Root size="lg" variant="outline" striped showColumnBorder stickyHeader>
                <Table.Header>
                    <Table.Row bg="bg.subtle">
                        <Table.ColumnHeader>date</Table.ColumnHeader>
                        <Table.ColumnHeader>Category</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">description</Table.ColumnHeader>
                        <Table.ColumnHeader >amount</Table.ColumnHeader>
                        <Table.ColumnHeader ></Table.ColumnHeader>
                        <Table.ColumnHeader ></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {expenses.map((item) => (
                        <Table.Row key={item.id}>
                            <Table.Cell>{item.date}</Table.Cell>
                            <Table.Cell>{item.category}</Table.Cell>
                            <Table.Cell textAlign="end">{item.description}</Table.Cell>
                            <Table.Cell textAlign="end">{item.amount}</Table.Cell>
                            <Table.Cell>
                                <IconButton bg="green.100"
                                    color="blackAlpha.800"><IoMdCreate /></IconButton>
                            </Table.Cell>
                            <Table.Cell>
                                <IconButton bg="green.100"
                                    color="blackAlpha.800"><TfiClose /></IconButton>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )
}