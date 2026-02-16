import { Box, Card } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";

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
          const label = context.dataset.label || "";
          const value = context.parsed.y || 0;
          return `${label}: ¥${value.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return "¥" + value.toLocaleString();
        },
      },
    },
  },
};

type Props = {
  data: any;
};

export const LineChart = (props: Props) => {
  return (
    <div>
      <Card.Root>
        <Card.Body>
          <Card.Title mb={4} fontSize="xl" color="gray.800">
            月次推移
          </Card.Title>
          <Box h="350px">
            <Line data={props.data} options={lineOptions} />
          </Box>
        </Card.Body>
      </Card.Root>
    </div>
  );
};
