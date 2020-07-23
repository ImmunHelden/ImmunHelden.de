import { useContext } from "react"
import { UserContext } from "../components/context/user-context"
import { AuthContext } from "../components/context/auth-context"

export const useSession = () => {
    const auth = useContext(AuthContext)
    const user = useContext(UserContext)
    return {
        user: {
            email: auth?.state?.user?.email,
            emailVerified: auth?.state?.user?.emailVerified,
            id: auth?.state?.user?.id,
            partnerIds: user?.state?.partnerIds,
        },
        partnerConfigs: user?.state?.partnerConfigs,
        isLoading: user?.state?.isLoadingPartner || user?.state?.isLoadingUser,
    }
}
