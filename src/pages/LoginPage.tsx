import { LoginForm } from "@/components/auth/LoginForm";

//責務：ログイン情報が正しければホーム画面に遷移する(ログイン画面のロジック)
export const LoginPage = () => {

    const authenticate=async()=>{
        
        // navigate("/dashbord")
    }
    return (
        <>
            <LoginForm onLoginClick={authenticate}/>
        </>
    )
}