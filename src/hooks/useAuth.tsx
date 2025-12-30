import { AuthContext } from "@/providers/AuthProvider";
import type { user } from "@/types/user";
import axios from "axios";
import { useContext, useState } from "react"

//責務：ログイン情報が正しいか判定、ログイン情報の保持
export const useAuth = () => {
    //ログイン情報
    const [loginUser] = useState<user>();
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    const { isAuth, setIsAuth } = context

    console.log("リクエスト前",isAuth)
    const getUserList = ((userId: string) => {
        axios.get<user[]>("https://jsonplaceholder.typicode.com/users")
            .then((res) => {
                //TODO:ユーザーを全権取得してフロントで認証する。しかし最終的にはバックでする
                const userList = res.data;
                userList.map((user) => {
                    if (user.id.toString() == userId) {
                        setIsAuth(true);
                    }
                })
            })
    })
    console.log("リクエスト後",isAuth);

    return { isAuth, loginUser, getUserList };
}