import './style.scss'

import { useEffect, useState } from 'react'
import { Route, Routes, Outlet } from 'react-router-dom'

import { useAuth } from '../auth'
import { SearchBar } from './SearchBar'
import { StockListItem } from './StockListItem'

import { LoadingSpinner, LoadingSpinnerVariants } from 'm3-react'

import { Stock } from '../../types/stocks'

import { searchStocks } from '../../api/stocksApi'

import { PageHeader } from '../common/PageHeader'

export const StockSearch = () => {
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
              <LoadingSpinner
                size={LoadingSpinnerVariants.LoadingSpinnerSizes.large}
              />
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
