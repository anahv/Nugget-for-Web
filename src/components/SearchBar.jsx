import React, {useState} from "react"
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

function SearchBar(props) {

  const [filterText, setFilterText] = useState("")
  const [activeSearch, setActiveSearch] = useState(false)

  function handleChange(event) {
    setFilterText(event.target.value)
    event.target.value && setActiveSearch(true)
    props.filterNuggets(filterText)
    if (!event.target.value) {props.fetchNuggets()}
  }

  function handleClose(event) {
    props.fetchNuggets()
    setFilterText("")
    setActiveSearch(false)
    event.preventDefault()
  }

  return (
    <div id="search-bar">
    <SearchIcon id="search-icon"/>
    <input
      onChange={handleChange}
      value={filterText}
      name="filter"
      placeholder="Search..."
      type="text"
    />
    {activeSearch &&
    <button onClick={handleClose}><CloseIcon /></button>}
    </div>
  )

}

export default SearchBar
