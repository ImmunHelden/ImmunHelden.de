import React from "react"
import { useSession } from "../../hooks/use-session"

export const UserInfo = () => {
    const { user } = useSession()
    return <h2>Hello, {user?.email}</h2>
}
