import React, { useEffect, useState } from "react"
import { useSession } from "../../hooks/use-session"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import "@material-ui/icons"
import { Grid, Paper } from "@material-ui/core"

async function fetchEntries(partner) {
    if (!partner) {
        return []
    }
    const res = await firebase.firestore().collection("blutspendende").where("partnerID", "==", partner).get()
    if (res.empty) {
        return []
    }
    return res.docs.reduce((prev, doc) => mapEntry(prev, { ...doc.data(), id: doc.id }), [])
}

function mapEntry(prev, doc) {
    const { title = "NA", latlng = {}, address = "NA", phone = "NA", email = "NA", contact = "NA", id = "NA" } = doc
    const { latitude, longitude } = latlng
    return [
        ...prev,
        {
            title,
            latitude,
            longitude,
            latlng,
            address,
            phone,
            email,
            contact,
            id,
        },
    ]
}

export const LocationOverview = () => {
    const { partner } = useSession()
    const [state, setState] = useState({ data: [] })

    useEffect(() => {
        async function getEntries() {
            if (partner) {
                const entries = await fetchEntries(partner)
                setState(prevState => ({ ...prevState, data: entries }))
            }
        }
        getEntries()
    }, [partner])

    const updateRow = (newData, oldData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { id, latitude, longitude, ...data } = newData
                const latlng = new firebase.firestore.GeoPoint(latitude, longitude)
                await firebase
                    .firestore()
                    .collection("blutspendende")
                    .doc(id)
                    .update({ ...data, latlng })

                setTimeout(() => {
                    resolve()
                    if (oldData) {
                        setState(prevState => {
                            const data = [...prevState.data]
                            data[data.indexOf(oldData)] = newData
                            return { ...prevState, data }
                        })
                    }
                }, 600)
            } catch (err) {
                console.error(err.message)
                reject()
            }
        })
    }
    const addRow = newData => {
        return new Promise(async (resolve, reject) => {
            try {
                const { id, latitude, longitude, ...rest } = newData
                const latlng = new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude))
                const newDocument = await firebase
                    .firestore()
                    .collection("blutspendende")
                    .add({ ...rest, latlng, partnerID: partner })

                setTimeout(() => {
                    resolve()
                    setState(prevState => ({
                        ...prevState,
                        data: mapEntry([...prevState.data], { ...rest, latlng, id: newDocument.id }),
                    }))
                }, 600)
            } catch (err) {
                console.error(err.message)
                reject()
            }
        })
    }
    const deleteRow = oldData => {
        return new Promise(async (resolve, reject) => {
            try {
                const { id } = oldData
                await firebase.firestore().collection("blutspendende").doc(id).delete()
                setTimeout(() => {
                    resolve()
                    setState(prevState => {
                        const data = [...prevState.data]
                        data.splice(data.indexOf(oldData), 1)
                        return { ...prevState, data }
                    })
                }, 600)
            } catch (err) {
                console.error(err.message)
                reject()
            }
        })
    }

    return (
        <Grid container justify="center" spacing={0} style={{ height: "100%" }}>
            <Grid item xs={12} lg={10}>
                <Paper style={{ maxWidth: "100%" }}>
                    <h1>Locations</h1>
                    <MaterialTable
                        style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.0)", backgroundColor: "transparent" }}
                        columns={[
                            { title: "ID", field: "id", hidden: true },
                            { title: "Title", field: "title" },
                            { title: "Latitude", field: "latitude", type: "numeric" },
                            { title: "Langitude", field: "longitude", type: "numeric" },
                            { title: "Adresse", field: "address" },
                            { title: "Telefon", field: "phone" },
                            { title: "Email", field: "email" },
                            { title: "Kontakt", field: "contact" },
                        ]}
                        data={state.data}
                        title=""
                        editable={{
                            onRowAdd: addRow,
                            onRowUpdate: updateRow,
                            onRowDelete: deleteRow,
                        }}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}
