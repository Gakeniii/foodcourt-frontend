"use client"
import { useSession } from "next-auth/react"

export default function About(){
    const {data, status}= useSession();
    console.log(data?.user.name)
    return(
        <>
        <h1>ABOUT</h1>
        <h2>Welcome, {data?.user.name}</h2>
        <h1>user id:{data?.user.id}</h1>
        <h1>email:{data?.user.email}</h1>
        
        </>
    )
}