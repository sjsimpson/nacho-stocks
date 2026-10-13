/** Required by the Eulerpool free tier on public pages. */
export function Attribution() {
  return (
    <p className="text-xs text-muted-foreground">
      Data by{' '}
      <a
        href="https://eulerpool.com"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        Eulerpool
      </a>
      . Quotes delayed 15 minutes. For education only, not investment advice.
    </p>
  )
}
