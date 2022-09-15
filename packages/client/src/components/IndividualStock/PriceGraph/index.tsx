import './style.scss'

import { useEffect, useState } from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryLabel,
  VictoryTheme,
  VictoryTooltip,
} from 'victory'
import { Loading, LoaderSizes } from '../../common/Loading'

import { getPriceHistory } from '../../../api/stocksApi'

import { DataPoint } from '../../../types/datapoint'

export const PriceGraph = ({ symbol }: { symbol: string }) => {
  let [priceHistory, setPriceHistory] = useState<DataPoint[]>([])
  let [color, setColor] = useState<string>('')
  let [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getPriceHistory(symbol)
      .then((res) => {
        setPriceHistory(res)
        updateColor(res)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log('Error in useEffect', err)
      })
  }, [])

  const updateColor = (prices: DataPoint[]) => {
    const diff = prices[prices.length - 1].y - prices[0].y
    setColor(diff < 0 ? 'red' : 'green')
  }

  return (
    <div className="graph-container">
      {isLoading ? (
        <Loading size={LoaderSizes.large} />
      ) : (
        <VictoryLine
          style={{ data: { stroke: color } }}
          data={priceHistory}
          animate
        />
      )}
    </div>
  )
}
