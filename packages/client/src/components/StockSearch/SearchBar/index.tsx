import { IconVariants, TextInput, TextInputVariants } from 'm3-react'
import { useState } from 'react'

export const SearchBar = ({ handleSearch }: { handleSearch: Function }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleKeyUp = (event: any) => {
    event.preventDefault()
    if (event.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  return (
    <TextInput
      id="seachInput"
      label="Search"
      value={searchTerm}
      onInput={(event: any) => setSearchTerm(event.target.value)}
      onKeyUp={handleKeyUp}
      icon={IconVariants.IconStyles.search}
      inputStyle={TextInputVariants.TextInputStyles.outlined}
      background={TextInputVariants.TextInputColors.surface}
      placeholder="Stock symbol (i.e. AAPL, GOOG)"
    />
  )
}
