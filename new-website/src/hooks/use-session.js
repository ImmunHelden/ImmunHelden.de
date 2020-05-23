import React, { useContext, createContext } from "react"

export const userContext = createContext({
    user: null,
})

export const useSession = () => {
    const { user } = useContext(userContext)
    return { user }
}
