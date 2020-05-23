import React, { useEffect, useState } from "react"
import { Button, Grid } from "@material-ui/core"
import { useSession } from "../../hooks/use-session"
import firebase from "gatsby-plugin-firebase"

function createTableRow({ title = "???", latlng, address = "???", phone = "---", email = "---", contact = "---" }) {
    return (
        <tr>
            <td>{title}</td>
            <td>{latlng?.latitude ?? "???"}</td>
            <td>{latlng?.longitude ?? "???"}</td>
            <td>{address}</td>
            <td>{phone}</td>
            <td>{email}</td>
            <td>{contact}</td>
        </tr>
    )
}

export const LocationOverview = () => {
    const { partner } = useSession()

    const [entries, setEntries] = useState([])

    useEffect(() => {
        async function getEntries() {
            if (partner) {
                console.log("before", partner)
                const res = await firebase
                    .firestore()
                    .collection("blutspendende")
                    .where("partnerID", "==", partner)
                    .get()
                if (!res.empty) {
                    const rawEntries = []
                    res.forEach(doc => rawEntries.push(doc.data()))
                    setEntries(rawEntries)
                }
            }
        }
        getEntries()
    }, [partner])

    console.log(entries)

    return (
        <table style={{ width: "100%", margin: "0 10px" }}>
            <tr>
                <th>Title</th>
                <th>Latitude</th>
                <th>Langitude</th>
                <th>Adresse</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Kontakt</th>
                <th></th>
            </tr>
            {entries.map(entry => createTableRow(entry))}
        </table>
    )
}
