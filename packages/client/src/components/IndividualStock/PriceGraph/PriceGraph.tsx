import './PriceGraph.scss'

import { useMemo } from 'react'
import { VictoryLine } from 'victory'
import { LoadingSpinner } from 'm3-react'

import { getPriceHistory } from '../../../queries/stocks'

interface PriceGraphProps {
  symbol: string
}
export default function PriceGraph(props: PriceGraphProps) {
  const { symbol } = props

  const history = getPriceHistory(symbol)

  const color = useMemo(() => {
    if (history.isSuccess) {
      const prices = history.data.data
      const diff = prices[prices.length - 1].y - prices[0].y
      return diff < 0 ? 'red' : 'green'
    }
  }, [history])

  return (
    <div className="graph-container">
      {history.isLoading ? (
        <LoadingSpinner size="large" />
      ) : (
        history.isSuccess && (
          <VictoryLine
            style={{ data: { stroke: color } }}
            data={history.data.data}
            animate
          />
        )
      )}
    </div>
  )
}
