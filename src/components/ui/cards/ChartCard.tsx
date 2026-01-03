import { Card, CardBody } from "@chakra-ui/react"
import type { FC, ReactNode } from "react";

type props={
  title:string;
  children:ReactNode
}

export const ChartCard:FC<props> = (props) => {
  return (
    <Card.Root m={5} p={5}>
      <CardBody gap="2">
        <Card.Title mb="2">{props.title}</Card.Title>
          {props.children}
      </CardBody>
    </Card.Root>
  )
}