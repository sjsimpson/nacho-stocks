import './StockSearch.scss'

import { useState } from 'react'

import SearchBar from './SearchBar'
import StockListItem from './StockListItem'

import { LoadingSpinner } from 'm3-react'

import { searchStocks } from '../../queries/stocks'

import PageHeader from '../common/PageHeader'
import { useToasts } from '../../context/ToastProvider'

export default function StockSearch() {
  const [enabled, setEnabled] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const toast = useToasts()
  const stocks = searchStocks(searchValue, enabled)

  const handleSearch = (searchValue: string) => {
    if (searchValue !== '') {
      setSearchValue(searchValue)
      setEnabled(true)
    } else {
      toast?.addToast({
        type: 'warn',
        message:
          'Cannot search for nothing. Please enter a symbol in the search bar',
      })
    }
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
          {stocks.isLoading && enabled ? (
            <div className="loading-content">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            stocks.isSuccess &&
            stocks.data.data.map((stock) => (
              <StockListItem key={stock.symbol} stock={stock} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
