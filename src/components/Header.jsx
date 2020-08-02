import React from "react"
import nuggetTransparent from "./nuggetTransparent.png"

function Header() {
  return (
      <header>
      <img id="headerLogo" src={nuggetTransparent} alt="Logo"/><h1>Nugget</h1>
      </header>
  )
}

export default Header
