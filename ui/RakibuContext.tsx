"use client"
import { createContext } from "react"
import createFastContext from "@/lib/createFastContext";

// const RakibuContext = createContext<any>({})

export const { Provider: RakibuProvider, useStore: useRakibu, Context: RakibuContext } = createFastContext<any>({
  wordDisplay: {text: true, image: false},
  currentWord: {}
})

export default RakibuContext;
