import './style.scss'

import { Icon, IconVariants } from 'm3-react'
import { useState } from 'react'

export const SearchBar = ({ handleSearch }: { handleSearch: Function }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [active, setActive] = useState<boolean>(false)

  const handleClick = (event: any) => {
    const searchInput = document.getElementById('searchInput')
    searchInput?.focus()
  }

  const handleInput = (event: any) => {
    event.preventDefault()
    console.log(event)

    setSearchTerm(event.target.value)
  }

  const handleKeyUp = (event: any) => {
    event.preventDefault()
    if (event.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  return (
    <div
      className={active ? 'search-bar active' : 'search-bar'}
      onClick={handleClick}
    >
      <div className="search-bar-content">
        <div className="icon-container">
          <Icon
            icon={IconVariants.IconStyles.search}
            color={IconVariants.IconColors.onSurfaceVariant}
          />
        </div>
        <div className="input-container">
          <label className={active || searchTerm ? 'active' : ''}>Search</label>
          <input
            id="searchInput" // Change this at some point, so this can be reused
            value={searchTerm}
            className={active || searchTerm ? 'active' : ''}
            onInput={handleInput}
            onKeyUp={handleKeyUp}
            placeholder={active ? 'Stock symbol (i.e. AAPL, GOOG)' : ''}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
          />
        </div>
        <div className="clear-input-container">
          {searchTerm && (
            <Icon
              onClick={() => {
                setSearchTerm('')
              }}
              icon={IconVariants.IconStyles.cancel}
              color={IconVariants.IconColors.onSurfaceVariant}
            />
          )}
        </div>
      </div>
    </div>
  )
}
