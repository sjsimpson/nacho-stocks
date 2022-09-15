import './style.scss'

import { useEffect, useState } from 'react'
import { VictoryLine } from 'victory'
import { Loading, LoaderSizes } from '../../common/Loading'

import { getPriceHistory } from '../../../api/stocksApi'

interface DataPoint {
  x: number
  y: number
}

export const Trendline = ({ symbol }: { symbol: string }) => {
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
    <div>
      {isLoading ? (
        <Loading size={LoaderSizes.large} />
      ) : (
        <VictoryLine
          style={{ data: { stroke: color, strokeWidth: 10 } }}
          data={priceHistory}
          animate
          // animate={{
          //   duration: 1000,
          //   // onLoad: { duration: 1000 },
          // }}
        />
      )}
    </div>
  )
}
