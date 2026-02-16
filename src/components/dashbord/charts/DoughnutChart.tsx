import { Box, Card, Text } from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";

type props = {
  categoryData: categoryData;
};

type categoryData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
};

export const doughnutOptions = {
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
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ¥${value.toLocaleString()}`;
        },
      },
    },
  },
};

export const DoughnutChart = (props: props) => {
  const hasData = props.categoryData.datasets[0]?.data.some((v) => v > 0);

  return (
    <Card.Root>
      <Card.Body>
        <Card.Title mb={4} fontSize="xl" color="gray.800">
          カテゴリ別支出
        </Card.Title>
        <Box h="350px" display="flex" alignItems="center" justifyContent="center">
          {hasData ? (
            <Doughnut data={props.categoryData} options={doughnutOptions} />
          ) : (
            <Text color="gray.400" fontSize="lg">
              データがありません
            </Text>
          )}
        </Box>
      </Card.Body>
    </Card.Root>
  );
};
