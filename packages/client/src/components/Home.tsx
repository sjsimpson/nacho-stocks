import { ContentBox } from './common/ContentBox'
import { ContentSection } from './common/ContentSection'

// import './Loading.scss'

export const Home = () => {
  return (
    <ContentSection>
      <ContentBox>
        Nacho Stocks
        <div>
          Welcome to the website that you can buy/sell stocks that aren't
          actually yours to practice buying/selling in the actual market.
          Investing can be scary (for a lot of reasons), and for me even the
          idea buying stocks was intimidating. Nacho Stocks was an attempt to
          alleviate that stressor for others!
        </div>
      </ContentBox>
    </ContentSection>
  )
}
