import './PageHeader.scss'

interface PageHeaderProps {
  title: string
  description: string
  centered?: boolean
}

export default function PageHeader(props: PageHeaderProps) {
  return (
    <div className="m3-page-header">
      <div
        className={'m3-header-container' + (props.centered ? ' centered' : '')}
      >
        <div
          className={'m3-title-wrapper' + (props.centered ? ' centered' : '')}
        >
          <div className="m3-header-title">{props.title}</div>
          <div className="m3-header-description">{props.description}</div>
        </div>
      </div>
    </div>
  )
}
