import React from 'react'
import Footer from "../footer/Footer"
import Nav from "../navbar/Navbar"

const Layout = ({ children }) => {
  return (
    <div>
      <Nav />

      <div className='content min-h-screen'>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout