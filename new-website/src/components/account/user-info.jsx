import React from "react"
import { useSession } from "../../hooks/use-session"

export const UserInfo = () => {
    const { user } = useSession()
    console.log("user", user)
    return <div>Hello, {user?.email}</div>
}
