import React, { createContext, useState, type FC, type ReactNode } from "react"

type props={
    children:ReactNode
}

type contextType={
    email:string;
    setEmail:React.Dispatch<React.SetStateAction<string>>;
}
export const ProfileContext=createContext<contextType|null>(null);

export const ProfileProvider:FC<props>=(props)=>{
    const [email,setEmail]=useState("");
    return(
        <ProfileContext.Provider value={{email,setEmail}}>
            {props.children}
        </ProfileContext.Provider>
    )
}