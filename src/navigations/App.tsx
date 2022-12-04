import React, { useCallback, useEffect } from "react"
import { Platform, StatusBar } from "react-native"
import { useFonts } from "expo-font"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import * as SplashScreen from "expo-splash-screen"
//import Menu from './Menu';
import { useData, ThemeProvider, TranslationProvider } from "../hooks"
import Home from "../screens/Home"
import Menu from "./Menu"

export default () => {
  const { isDark, theme, setTheme } = useData()
  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === "android" && StatusBar.setTranslucent(true)
    StatusBar.setBarStyle(isDark ? "light-content" : "dark-content")
    return () => {
      StatusBar.setBarStyle("default")
    }
  }, [isDark])

  // load custom fonts
  const [fontsLoaded] = useFonts({
    "OpenSans-Light": theme.assets.OpenSansLight,
    "OpenSans-Regular": theme.assets.OpenSansRegular,
    "OpenSans-SemiBold": theme.assets.OpenSansSemiBold,
    "OpenSans-ExtraBold": theme.assets.OpenSansExtraBold,
    "OpenSans-Bold": theme.assets.OpenSansBold,
  })

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync()
    }
    prepare()
  }, [])

  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: "rgba(0,0,0,0)",
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  }

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer onReady={onLayoutRootView} theme={navigationTheme}>
          <Menu />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  )
}
