import { TextInput } from 'm3-react'
import { useState } from 'react'

export default function SearchBar({
  handleSearch,
}: {
  handleSearch: Function
}) {
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
        icon="search"
        inputStyle="outlined"
        background="surface"
        placeholder="Stock symbol (i.e. AAPL, GOOG)"
      />
    </form>
  )
}
