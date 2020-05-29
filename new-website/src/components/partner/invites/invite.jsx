import React from "react"

export const Invite = ({ invite }) => {
    const { email } = invite
    return <li key={`${email}-test`}>{email}</li>
}
