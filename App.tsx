import "react-native-gesture-handler"
import React from "react"

import { DataProvider } from "./src/hooks"
import AppNavigation from "./src/navigations/App"

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  )
}
