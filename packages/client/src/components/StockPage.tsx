import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Loading, LoaderSizes } from './common/Loading'
import { StockListItem } from './common/StockListItem'
import { StockGraph } from './common/StockGraph'
import { Stock } from '../types/stocks'

export const StockPage = () => {
  const [stock, setStock] = useState<Stock | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { stockId } = useParams()

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await fetch(`http://localhost:3001/stock/${stockId}`)
      const stock = await res.json()
      console.log('response.text', stock)
      setStock(stock)
    }
    fetchStocks()
      .then((res) => {
        setIsLoading(false)
      })
      .catch((err) => {
        console.log('Error in useEffect', err)
      })
  }, [])

  return (
    <div className="stocks">
      <span className="stocks-header">
        {isLoading ? <Loading size={LoaderSizes.large} /> : stock?.name}
      </span>
      <span className="symbol">
        {isLoading ? <Loading size={LoaderSizes.large} /> : stock?.symbol}
      </span>
      <span className="price">{100}</span>
      <div className="stock-id">{stockId}</div>
      <div className="graph">
        <StockGraph symbol={stockId!} />
      </div>
    </div>
  )
}
