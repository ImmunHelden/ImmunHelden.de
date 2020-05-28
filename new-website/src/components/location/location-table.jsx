import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { mapLocation } from "../../util/location"
import { useCollection } from "react-firebase-hooks/firestore"
function mapEntry() {}

export const LocationTable = ({ partner, locations = [] }) => {
    const [state, setState] = useState({ data: [...locations] })

    React.useEffect(() => {
        setState({ data: [...locations] })
    }, [locations])

    const onRowUpdate = ({ id, latlng, ...rest }) => {
        const geoPoint = new firebase.firestore.GeoPoint(parseFloat(latlng.latitude), parseFloat(latlng.longitude))
        return firebase
            .firestore()
            .collection("blutspendende")
            .doc(id)
            .update({ ...rest, latlng: geoPoint, latlng })
    }

    const onRowAdd = ({ id, latlng, ...rest }) => {
        const geoPoint = new firebase.firestore.GeoPoint(parseFloat(latlng.latitude), parseFloat(latlng.longitude))
        return firebase
            .firestore()
            .collection("blutspendende")
            .add({ ...rest, latlng: geoPoint, partnerID: partner })
            .catch(err => console.log(err.message))
    }

    const onRowDelete = ({ id }) =>
        firebase
            .firestore()
            .collection("blutspendende")
            .doc(id)
            .delete()
            .catch(err => console.log(err.message))

    return (
        <MaterialTable
            style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.0)", backgroundColor: "transparent" }}
            columns={[
                { title: "ID", field: "id", hidden: true },
                { title: "Title", field: "title" },
                { title: "Latitude", field: "latlng.latitude", type: "numeric" },
                { title: "Longitude", field: "latlng.longitude", type: "numeric" },
                { title: "Adresse", field: "address" },
                { title: "Telefon", field: "phone" },
                { title: "Email", field: "email" },
                { title: "Kontakt", field: "contact" },
            ]}
            data={state.data}
            title=""
            editable={{
                onRowAdd,
                onRowUpdate,
                onRowDelete,
            }}
        />
    )
}
