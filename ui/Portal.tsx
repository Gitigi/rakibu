"use client"

import ReactDOM from "react-dom"
import { useEffect, useState } from "react"

export default function Portal ({ selector, children }: any) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
     setMounted(true)

     return () => setMounted(false)
  }, [])

  return mounted
     ? ReactDOM.createPortal(children, document.querySelector(selector)!!)
     : null
}
