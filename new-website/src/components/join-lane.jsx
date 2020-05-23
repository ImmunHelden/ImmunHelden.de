import React from "react"
import superhero from "../images/superhero.png"
import { ThreeBoxesRow } from "../components/layout/three-boxes-lane/three-boxes-row"
import { useIntl } from "gatsby-plugin-intl"

export const JoinLane = () => {
    const { formatMessage } = useIntl()
    const title = formatMessage({ id: "joinLaneTitle" })

    const joinBoxes = [
        {
            image: superhero,
            text: formatMessage({ id: "joinLaneOfferHelp" }),
            link: null,
        },
        {
            image: superhero,
            text: formatMessage({ id: "joinLaneNeedHelp" }),
            link: null,
        },
        {
            image: superhero,
            text: formatMessage({ id: "joinLaneFAQ" }),
            link: "/faq",
        },
    ]

    return <ThreeBoxesRow title={title} items={joinBoxes} />
}
