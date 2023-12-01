// import ContentBox from './common/ContentBox'
// import ContentSection from './common/ContentSection'

import PageHeader from './common/PageHeader'

export default function Home() {
  return (
    <>
      <PageHeader
        title="Nacho Stocks"
        description="Welcome to the world of simple paper trading!"
        centered
      />
      <div>
        <p>
          Bad news everyone!! Historical data is no longer free from the Finnhub
          API, so price history of a stock is no longer viewable... cool huh?!
        </p>
        <p>
          ...anyway, that doesn't kill this app... but will require some heavy
          refactors to the UI. Please enjoy what is still available.
        </p>
        <p>- Spencer</p>
      </div>
    </>
  )
}
