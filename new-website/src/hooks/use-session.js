import { useContext } from "react"
import { UserContextProvider, UserContext } from "../components/context/user-context"
import { AuthContext } from "../components/context/auth-context"

export const useSession = () => {
    const auth = useContext(AuthContext)
    const user = useContext(UserContext)
    return {
        user: {
            id: auth?.state?.userId,
        },
        partners: user?.state?.partnerIds,
    }
}
