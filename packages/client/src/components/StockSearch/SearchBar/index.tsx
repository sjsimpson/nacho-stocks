import { IconVariants, TextInput, TextInputVariants } from 'm3-react'
import { useState } from 'react'

export const SearchBar = ({ handleSearch }: { handleSearch: Function }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSubmit = (event: any) => {
    event.preventDefault()
    console.log(event)
    handleSearch(searchTerm)
  }

  return (
    <form action="." onSubmit={handleSubmit}>
      <TextInput
        id="seachInput"
        label="Search"
        type="search"
        value={searchTerm}
        onInput={(event: any) => setSearchTerm(event.target.value)}
        icon={IconVariants.IconStyles.search}
        inputStyle={TextInputVariants.TextInputStyles.outlined}
        background={TextInputVariants.TextInputColors.surface}
        placeholder="Stock symbol (i.e. AAPL, GOOG)"
      />
    </form>
  )
}
