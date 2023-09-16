import './StockSearch.scss'

import { useState } from 'react'

import { useAuth } from '../auth'
import SearchBar from './SearchBar'
import StockListItem from './StockListItem'

import { LoadingSpinner } from 'm3-react'

import { searchStocks } from '../../api/stocksApi'

import PageHeader from '../common/PageHeader'

export default function StockSearch() {
  let [stocks, setStocks] = useState<Stock[]>([])
  let [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSearch = (searchValue: string) => {
    console.log('handle-search')
    setIsLoading(true)

    searchStocks(searchValue)
      .then((res: any) => {
        setStocks(res)
        setIsLoading(false)
      })
      .catch((err: any) => {
        setIsLoading(false)
        console.log('Error in useEffect', err)
      })
  }

  return (
    <div className="stocks">
      <PageHeader
        title="Stock Search"
        description="Search for a stocks using its symbol."
      />
      <div>
        <div className="search-container">
          <SearchBar handleSearch={handleSearch} />
        </div>
        <div>
          {isLoading ? (
            <div className="loading-content">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            stocks.map((stock) => (
              <StockListItem key={stock.symbol} stock={stock} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
