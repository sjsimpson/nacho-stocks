import { Button, Icon, TextInput } from 'm3-react'
import { useState } from 'react'

export default function SearchBar({
  handleSearch,
}: {
  handleSearch: Function
}) {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSubmit = (event: any) => {
    event.preventDefault()
    handleSearch(searchTerm)
  }

  return (
    <form id="search-form" action="." onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <TextInput
          id="seachInput"
          label="Search"
          type="search"
          value={searchTerm}
          onInput={(event: any) => setSearchTerm(event.target.value)}
          icon="search"
          inputStyle="outlined"
          background="surface"
          placeholder="Stock symbol (i.e. AAPL, GOOG)"
        />
        <Button
          form="search-form"
          type="submit"
          icon="search"
          iconOnly
          text="Search"
          onClick={() => handleSearch(searchTerm)}
        />
      </div>
    </form>
  )
}
