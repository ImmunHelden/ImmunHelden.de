import React from 'react'
import Navbar from '../components/navbar'

export default function Layout({ children }) {
  return (
    <div className="font-body overflow-x-hidden">

      <Navbar />

      {children}
    </div>
  )
}