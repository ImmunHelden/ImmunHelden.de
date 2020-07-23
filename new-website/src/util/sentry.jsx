import * as Sentry from "@sentry/browser"

export function sentryInfo(msg) {
  Sentry.withScope(scope => {
    scope.setLevel("info")
    Sentry.captureEvent({ message: msg })
  })
}

export function sentryWarn(msg) {
  Sentry.withScope(scope => {
    scope.setLevel("warning")
    Sentry.captureEvent({ message: msg })
  })
}

export function sentryFatal(err) {
  Sentry.withScope(scope => {
    scope.setLevel("fatal")
    Sentry.captureException(err)
  })
}
