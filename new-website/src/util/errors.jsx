
// Hack: Apparently, `throw new Error("code")` prepends a `Error: ` prefix to
// any given code. In order to allow passing error codes this way, we have to
// trim the prefix.
export function mayTrimErrorPrefix(err) {
  // When `err` was caught in an exception handler, its type is a raw `object`
  // with no properies at all. We use concat here to obtain a string.
  const str = err + ''
  const prefix = 'Error: '
  return str.startsWith(prefix) ? str.substring(prefix.length) : str
}
