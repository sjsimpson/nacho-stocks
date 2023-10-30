// import './PriceGraph.scss'

import { useMemo } from 'react'
import { VictoryLine } from 'victory'

import { DataPoint } from '../../../../types/datapoint'

export default function ValueHistory({
  priceHistory,
}: {
  priceHistory: DataPoint[]
}) {
  const color = useMemo(() => {
    console.log('pricehistory', priceHistory)
    const diff = priceHistory[priceHistory.length - 1].y - priceHistory[0].y
    return diff < 0 ? 'red' : 'green'
  }, [priceHistory])

  return (
    <div className="graph-container">
      <VictoryLine
        style={{ data: { stroke: color } }}
        data={priceHistory}
        animate
      />
    </div>
  )
}
