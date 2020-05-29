import React, { useState } from "react"
import firebase from "gatsby-plugin-firebase"
import MaterialTable from "material-table"
import { LOCATION_COLLECTION } from "."

export const LocationTable = ({ partner, locations = [] }) => {
    const [state, setState] = useState({ data: [...locations] })

    React.useEffect(() => {
        setState({ data: [...locations] })
    }, [locations])

    const onRowUpdate = ({ id, ...rest }) => {
        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .doc(id)
            .update({ ...rest })
    }

    const onRowAdd = ({ id, ...rest }) => {
        return firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .add({ ...rest, partnerID: partner })
            .catch(err => console.log(err.message))
    }

    const onRowDelete = ({ id }) =>
        firebase
            .firestore()
            .collection(LOCATION_COLLECTION)
            .doc(id)
            .delete()
            .catch(err => console.log(err.message))

    return (
        <MaterialTable
            style={{ boxShadow: "0px 0px 0px rgba(0,0,0,0.0)", backgroundColor: "transparent" }}
            columns={[
                { title: "ID", field: "id", hidden: true },
                { title: "Title", field: "title" },
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
