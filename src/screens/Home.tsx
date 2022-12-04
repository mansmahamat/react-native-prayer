import React, { useState, useEffect, useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import * as Location from "expo-location"
import { useData, useTheme, useTranslation } from "../hooks/"
import { Block, Button, Image, Input, Product, Text } from "../components/"
import Geocoder from "react-native-geocoding"
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan"
import { SafeAreaView, View, FlatList, StyleSheet } from "react-native"
import moment from "moment"

function Home() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<number>(0)
  const { following, trending } = useData()
  const [products, setProducts] = useState(following)
  const { assets, colors, fonts, gradients, sizes } = useTheme()
  const [location, setLocation] = useState<Location.LocationObject>()
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [city, setCity] = useState<string>("")

  Geocoder.init("")

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  let text = "Waiting.."
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }

  const renderItem = ({ item }: any) => (
    <Item title={item.title} time={item.time} />
  )

  const Item = ({ title, time }: any) => (
    <View style={styles.item}>
      <Text color={colors.white} font={fonts.extrabold} style={styles.title}>
        {title}
      </Text>
      <Text color={colors.white} font={fonts.bold} style={styles.time}>
        {time}
      </Text>
    </View>
  )

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab)
      setProducts(tab === 0 ? following : trending)
    },
    [following, trending, setTab, setProducts]
  )

  //  console.log(location?.coords.latitude)

  Geocoder.from(
    Number(location?.coords.latitude),
    Number(location?.coords.longitude)
  )
    .then((json) => {
      var addressComponent = json.results[0].address_components[3].long_name
      setCity(addressComponent)
      //  console.log(addressComponent)
    })
    .catch((error) => console.warn(error))

  const coordinates = new Coordinates(
    Number(location?.coords.latitude),
    Number(location?.coords.longitude)
  )
  const params = CalculationMethod.MuslimWorldLeague()
  const date = new Date()
  const prayerTimes = new PrayerTimes(coordinates, date, params)
  console.log("SALAT", moment(prayerTimes.fajr).format("h:mm A"))

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Fajr",
      time: moment(prayerTimes.fajr).format("h:mm A"),
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Dhur",
      time: moment(prayerTimes.dhuhr).format("h:mm A"),
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Asr",
      time: moment(prayerTimes.asr).format("h:mm A"),
    },
    {
      id: "58694addzzz0f-3da1-47efefef-bd96-145571e29d72",
      title: "Maghrib",
      time: moment(prayerTimes.maghrib).format("h:mm A"),
    },
    {
      id: "58694addzzz0f-3dadddd1-471f-bd96-145571e29d72",
      title: "Isha",
      time: moment(prayerTimes.isha).format("h:mm A"),
    },
  ]

  const salat = JSON.stringify(prayerTimes)
  return (
    <Block>
      {/* search input */}
      <Text>You're in {city}</Text>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t("common.search")} />
      </Block>

      {/* toggle products list */}
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}
      >
        <Button onPress={() => handleProducts(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? "success" : "success"]}
            >
              <Image source={assets.extras} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? "medium" : "normal"]}>
              {t("home.following")}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? "primary" : "secondary"]}
            >
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? "medium" : "normal"]}>
              {t("home.trending")}
            </Text>
          </Block>
        </Button>
      </Block>

      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.l }}
      >
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {products?.map((product) => (
            <Product {...product} key={`card-${product?.id}`} />
          ))}
        </Block>
      </Block>
    </Block>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  item: {
    backgroundColor: "#42855B",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color: "#FFDCAE",
  },
  time: {
    fontSize: 32,
    color: "#fffff",
  },
})

export default Home
