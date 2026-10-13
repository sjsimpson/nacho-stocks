import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/page-header'
import { PortfolioView } from '@/components/portfolio-view'
import { myPortfolioQuery } from '@/lib/queries'

export const Route = createFileRoute('/_authed/portfolio')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(myPortfolioQuery()),
  head: () => ({ meta: [{ title: 'Portfolio · Nacho Stocks' }] }),
  component: PortfolioPage,
})

function PortfolioPage() {
  const { data } = useSuspenseQuery(myPortfolioQuery())
  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Your cash, stocks, and trades."
      />
      <PortfolioView portfolio={data.portfolio} history={data.history} />
    </>
  )
}
