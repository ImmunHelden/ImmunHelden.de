import React from "react"
import { Button, Grid } from "@material-ui/core"

export const LocationOverview = () => {
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
            <tr>
                <td>Blutspende am Universitätsklinikum Freiburg</td>
                <td>48.0066478</td>
                <td>7.8381151</td>
                <td>Hugstetter Str. 55, 79106 Freiburg</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
                <td>
                    <Button>✏️</Button>
                    <Button>❌</Button>
                </td>
            </tr>
            <tr>
                <td>Blutspendedienst Hamburg-Wandsbek</td>
                <td>53.5734028</td>
                <td>10.0669343</td>
                <td>Quarree 8-10, 22041 Hamburg</td>
                <td>040 20002200</td>
                <td>info@blutspendehamburg.de</td>
                <td>Quarree 2, 3. Obergeschoss</td>
                <td>
                    <Grid container>
                        <Grid item xs={6} component={Button}>
                            ✏️
                        </Grid>
                        <Grid item xs={6} component={Button}>
                            ❌
                        </Grid>
                    </Grid>
                </td>
            </tr>
        </table>
    )
}
