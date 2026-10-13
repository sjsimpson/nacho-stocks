import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ChevronRightIcon, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { PageHeader } from '@/components/page-header'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounced } from '@/hooks/use-debounced'
import { stockSearchQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/stocks/')({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [{ title: 'Find stocks · Nacho Stocks' }] }),
  component: StockSearch,
})

function StockSearch() {
  const { q = '' } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [input, setInput] = useState(q)
  const query = useDebounced(input.trim(), 300)

  // Keep the URL in sync so searches can be shared and survive reloads.
  useEffect(() => {
    if (query !== q) {
      void navigate({ search: { q: query || undefined }, replace: true })
    }
  }, [query, q, navigate])

  const { data, isFetching, isError } = useQuery(stockSearchQuery(query))

  return (
    <>
      <PageHeader
        title="Find stocks"
        description="Search US stocks by name or ticker."
      />
      <search className="relative mb-6 block max-w-xl">
        <label htmlFor="stock-search" className="sr-only">
          Search stocks
        </label>
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="stock-search"
          type="search"
          placeholder="Apple, TSLA, Coca-Cola…"
          className="pl-9"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </search>

      <section aria-live="polite" aria-busy={isFetching}>
        {!query ? (
          <p className="text-muted-foreground">
            Type a company name or ticker to start.
          </p>
        ) : isFetching && !data ? (
          <ul className="max-w-xl space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i}>
                <Skeleton className="h-14 w-full" />
              </li>
            ))}
          </ul>
        ) : isError ? (
          <p className="text-destructive">Search failed. Try again.</p>
        ) : data?.length ? (
          <>
            <h2 className="sr-only">Results for “{query}”</h2>
            <ul className="max-w-xl divide-y rounded-lg border">
              {data.map((s) => (
                <li key={s.symbol}>
                  <Link
                    to="/stocks/$symbol"
                    params={{ symbol: s.symbol }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 focus-visible:bg-muted/50"
                  >
                    <span className="w-16 font-mono font-semibold">
                      {s.symbol}
                    </span>
                    <span className="flex-1 truncate">{s.name}</span>
                    <ChevronRightIcon
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-muted-foreground">No US stocks match “{query}”.</p>
        )}
      </section>
    </>
  )
}
