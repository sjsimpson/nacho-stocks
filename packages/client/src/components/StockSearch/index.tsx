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
  // let [searchValue, setSearchValue] = useState<string>('')
  let [isLoading, setIsLoading] = useState<boolean>(false)
  // let [searchParams, setSearchParams] = useSearchParams()
  // const { token } = useAuth()

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

  // Check Auth
  // return (
  //   <>
  //     {token ? (
  //       <main className="home">
  //         <h2>STOCKS</h2>
  //         <div>
  //           <h3>Positions</h3>
  //           <nav>
  //             <input
  //               value={searchParams.get('filter') || ''}
  //               onChange={(event) => {
  //                 let filter = event.target.value
  //                 if (filter) {
  //                   setSearchParams({ filter })
  //                 } else {
  //                   setSearchParams({})
  //                 }
  //               }}
  //             />
  //             {stocks!
  //               .filter((stock) => {
  //                 let filter = searchParams.get('filter')
  //                 if (!filter) return true
  //                 let name = stock.description.toLowerCase()
  //                 return name.startsWith(filter.toLowerCase())
  //               })
  //               .map((stock) => (
  //                 <NavLink
  //                   className="stock"
  //                   to={`/stocks/${stock.displaySymbol}`}
  //                   key={stock.displaySymbol}
  //                 >
  //                   {stock.description}
  //                 </NavLink>
  //               ))}
  //           </nav>
  //         </div>
  //       </main>
  //     ) : (
  //       <div> Auth Failed </div>
  //     )}
  //   </>
  // )
}
