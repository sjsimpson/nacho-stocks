import './Loading.scss'

export enum LoaderSizes {
  small = 'small',
  large = 'large',
}

export const Loading = ({ size }: { size: LoaderSizes }) => (
  <div className={`loading ${size}`}>
    <svg className="circular" viewBox="25 25 50 50">
      <circle
        cx={50}
        cy={50}
        r="20"
        stroke="black"
        fill="none"
        strokeWidth={3.6}
      />
    </svg>
  </div>
)
