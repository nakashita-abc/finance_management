import React, { createContext, useState, type FC, type ReactNode } from "react"

type props={
    children:ReactNode
}

type contextType={
    isAuth:boolean;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthContext=createContext<contextType|null>(null);

export const AuthProvider:FC<props>=(props)=>{
    const [isAuth,setIsAuth]=useState(false);
    return(
        <AuthContext.Provider value={{isAuth,setIsAuth}}>
            {props.children}
        </AuthContext.Provider>
    )
}