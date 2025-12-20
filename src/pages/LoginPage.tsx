import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//責務：ログイン情報が正しければホーム画面に遷移する
export const LoginPage = () => {
    const navigate=useNavigate();
    const {isAuth, loginUser, getUserList}=useAuth();
    const [enteredLoginId,setEnteredLoginId]=useState<string>();

    const authenticate=()=>{
        //useAuth呼び出し→入力データが正しければauthContextをtrue
        getUserList("2");
        navigate("/dashbord")
    }
    return (
        <>
            <LoginForm onLoginClick={authenticate}/>
        </>
    )
}