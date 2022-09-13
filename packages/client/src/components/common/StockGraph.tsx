import { useEffect, useState } from 'react'
import { VictoryLine } from 'victory'
import { Loading, LoaderSizes } from './Loading'

interface DataPoint {
  x: number
  y: number
}

export const StockGraph = ({ symbol }: { symbol: string }) => {
  const [priceHistory, setPriceHistory] = useState<DataPoint[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getPriceHistory = async () => {
      const res = await fetch(
        `http://localhost:3001/stock/${symbol}/price-history`
      )
      const prices = await res.json()
      console.log('response.text', prices)
      setPriceHistory(prices)
    }
    getPriceHistory()
      .then((res) => {
        setIsLoading(false)
      })
      .catch((err) => {
        console.log('Error in useEffect', err)
      })
  }, [])
  return (
    <div>
      {isLoading ? (
        <Loading size={LoaderSizes.large} />
      ) : (
        <VictoryLine
          data={priceHistory}
          animate={{
            duration: 1000,
          }}
        />
      )}
    </div>
  )
}
