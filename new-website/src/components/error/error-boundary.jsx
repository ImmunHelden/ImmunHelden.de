import React from "react"
import * as Sentry from "@sentry/browser"
import { FormattedMessage } from "gatsby-plugin-intl"

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, sentryId: null }
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope(scope => {
            scope.setLevel("warning")
            const eventId = Sentry.captureException({ message: "error" })
            this.setState({ sentryId: eventId })
        })
        // You can also log the error to an error reporting service
        console.log(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return [
                <FormattedMessage id="somethingBroke" />,
                <p style={{ fontSize: "0.7rem", fontStyle: "italic" }}>
                    ({new Date().toDateString()} - {this.state.sentryId})
                </p>,
            ]
        }

        return this.props.children
    }
}
