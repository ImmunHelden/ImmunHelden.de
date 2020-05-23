import React, { useContext, createContext } from "react"

export const userContext = createContext({
    user: null,
    partners: null,
})

export const useSession = () => {
    const { user, partners } = useContext(userContext)
    return { user, partners }
}
