import { useContext } from "react"
import Register from "./RegisterAndLoginForm"
import { UserContext } from "./UserContext"

export default function Routes() {
    const { username, id } = useContext(UserContext)

    if (username) {
        return 'Welcome ' + username;
    }

    return (
        <Register />
    )
}