import React, { useContext } from "react"
import { useSession } from "../../hooks/use-session"
import { UserContext } from "../context/user-context"

export const UserInfo = () => {
    const userContext = useContext(UserContext)
    console.log(userContext.state)
    const { user } = useSession()
    return <h2>Hello, {user?.email}</h2>
}
