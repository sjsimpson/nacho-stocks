import { ContentBox } from './common/ContentBox'
import { ContentSection } from './common/ContentSection'
import { LoaderSizes, Loading } from './common/Loading'
import { MainContent } from './common/MainContent'

// import './Loading.scss'

export const Home = () => {
  return (
    <ContentSection>
      <ContentBox>
        TESTING
        <span className="material-symbols-outlined">search</span>
        <Loading size={LoaderSizes.small} />
        <Loading size={LoaderSizes.large} />
      </ContentBox>
    </ContentSection>
  )
}
