import { useParams } from "react-router-dom"

export const ExpenseFormPage=()=>{
    const {id}=useParams();
    return(
        <>
        expenseForm
        {id}
        </>
    )
}