import { Button } from "@chakra-ui/react"
import type { FC } from "react"

type props={
    onClickBackToTop:()=>void
}

export const LogoutPage:FC<props>=(props)=>{
    return(
        <>
        <Button bg={"transparent"} color={"blackAlpha.400"} onClick={props.onClickBackToTop}>sign out</Button>
        </>
    )
}