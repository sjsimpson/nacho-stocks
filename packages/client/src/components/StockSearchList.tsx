import './styles/Stocks.scss'

import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useAuth } from './auth'
import { SearchBar } from './common/SearchBar'
import { StockListItem } from './common/StockListItem'

import { NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { LoaderSizes, Loading } from './common/Loading'
import { StockPage } from './StockPage'

import { Stock } from '../types/stocks'

export const StockSearchList = () => {
  let [stocks, setStocks] = useState<Stock[]>([])
  // let [searchValue, setSearchValue] = useState<string>('')
  let [isLoading, setIsLoading] = useState<boolean>(false)
  // let [searchParams, setSearchParams] = useSearchParams()
  const { token } = useAuth()

  // useEffect(() => {
  //   const fetchStocks = async () => {
  //     const res = await fetch('http://localhost:3001/stocks', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-API-TOKEN': token,
  //       },
  //     })

  //     const test = await res.json()
  //     console.log('response.text', test)
  //     setStocks(test)
  //   }

  //   fetchStocks()
  //     .then((res) => {
  //       setIsLoading(false)
  //     })
  //     .catch((err) => {
  //       setIsLoading(false)
  //       console.log('Error in useEffect', err)
  //     })
  // }, [])

  const handleSearch = (searchValue: string) => {
    console.log('handle-search')
    setIsLoading(true)
    const searchStocks = async () => {
      const res = await fetch(
        `http://localhost:3001/stocks/search/${searchValue}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-TOKEN': token,
          },
        }
      )

      const body = await res.json()
      console.log('response.json', body)
      setStocks(body)
    }

    searchStocks()
      .then((res) => {
        setIsLoading(false)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log('Error in useEffect', err)
      })
  }

  // const handleInputChange = (event: any) => {
  //   event.preventDefault()
  //   setSearchValue(event.target.value)
  // }

  // const handleKeyDown = (event: any) => {
  //   console.log('User pressed: ', event.key)

  //   if (event.key === 'Enter') {
  //     console.log('Enter key pressed ✅')
  //     handleSearch()
  //   }
  // }

  // if (isLoading) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className="stocks">
      <span className="stocks-header">Stocks</span>
      <div>
        <div className="search-container">
          <SearchBar handleSearch={handleSearch} />
        </div>
        <div>
          {isLoading ? (
            <div>
              <Loading size={LoaderSizes.large} />
            </div>
          ) : (
            stocks.map((stock) => (
              <StockListItem key={stock.symbol} stock={stock} />
            ))
          )}
        </div>
      </div>

      <Routes>
        {stocks.map((stock) => (
          <Route
            path="/messages/:stockId"
            element={<StockPage stock={stock} />}
          />
        ))}
      </Routes>
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
