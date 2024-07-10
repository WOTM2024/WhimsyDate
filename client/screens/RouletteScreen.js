// RouletteScreen.js
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";

import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { fetchActivities, fetchEntriesByUserCategory } from "../api";

const window = Dimensions.get("window");
const scale = 0.7;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = 500 * scale;

const tempImage = require("../assets/placeholder_img.png");

export default function RouletteScreen({ route }) {
  const [categoryEntries, setCategoryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [imageUris, setImageUris] = useState(images);
  const [isVetoed, setIsVetoed] = useState(1);
  const [isSpinUsed, setIsSpinUsed] = useState(false);

  const uid = auth.currentUser?.uid;

  // isSpinUsed to true
  // grey out spin button - can't be pressed
  // veto pressed -> spins carousel
  // isVetoed = 0
  // grey out veto button

  const { categoryObj } = route.params;

  const category_path = categoryObj.path_name;

  function categoryEntriesRandomisation(categoryEntriesData) {
    for (let i = categoryEntriesData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [categoryEntriesData[i], categoryEntriesData[j]] = [categoryEntriesData[j], categoryEntriesData[i]];
    }
    return setCategoryEntries(categoryEntriesData);
  }

  useEffect(() => {
    fetchEntriesByUserCategory(uid, category_path).then((data) => {
      categoryEntriesRandomisation(data);
      setIsLoading(false);
    });
  }, [category_path]);

  const navigation = useNavigation();
  function onPressHandle_navActivities() {
    navigation.navigate("Activities");
  }
  function onPressHandle_navInspiration() {
    navigation.navigate("Inspiration");
  }

  const animationStyle = useCallback((value) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 10]);
    const rotateZ = `${interpolate(value, [-4, 0, 4], [-45, 0, 45])}deg`;
    const translateX = interpolate(value, [-1.4, 0, 1.4], [-window.width, 0, window.width]);

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);

  function changeIsSpinning() {
    setIsSpinning(false);
  }

  function onPressHandle_spinStatus() {
    setIsSpinUsed(true);

    const randomNo = Number(Math.floor(Math.random() * 3) + 1 + "000");

    setIsSpinning(true);

    setTimeout(changeIsSpinning, randomNo);
  }

  // const [isVetoed, setIsVetoed] = useState(1);
  // const [isSpinUsed, setIsSpinUsed] = useState(false);

  // isSpinUsed to true
  // @TODO grey out spin button - can't be pressed
  // veto pressed -> spins carousel
  // isVetoed = 0
  // grey out veto button

  function onPressHandle_veto() {
    setIsVetoed(0);

    onPressHandle_spinStatus();
  }

  return (
    <LinearGradient colors={["#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <View className="flex-1 items-center ">
        <View className="m-10" />
        <Text className="text-3xl font-semibold">{categoryObj.category_name}</Text>
        {!isLoading ? (
          <Carousel
            loop
            className="h-full items-center justify-center"
            style={{
              width: window.width,
            }}
            width={PAGE_WIDTH}
            height={PAGE_HEIGHT}
            autoPlay={isSpinning}
            autoPlayInterval={30}
            scrollAnimationDuration={30}
            data={categoryEntries}
            renderItem={({ index }) => {
              const imageSource = imageUris[index].uri ? { uri: imageUris[index].uri } : tempImage;
              let key_name;
              switch (categoryObj.category_name) {
                case "Activities":
                  key_name = "activity_name";
                  break;
                case "Food":
                  key_name = "food";
                  break;
                case "Films":
                  key_name = "film";
                  break;
                case "Tv Shows":
                  key_name = "show";
                  break;
              }
              const categoryEntriesIndex = categoryEntries[index];
              return (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1e1e1e",
                    borderColor: "white",
                    borderStyle: "solid",
                    borderWidth: 4,
                    borderRadius: 10,
                  }}
                >
                  {/* <Image
                  source={imageSource}
                  style={{
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                  }}
                    ${isSpinUsed ? "pointer-events-none" : ""}
                /> */}
                  <Text style={{ fontWeight: "bold", fontSize: 30, color: "#fff" }}>
                    {categoryEntriesIndex[key_name]}
                  </Text>
                </View>
              );
            }}
            customAnimation={animationStyle}
          />
        ) : (
          <Text>Loading...</Text>
        )}

        <View pointerEvents={`${isSpinUsed ? "none" : "auto"}`}>
          <TouchableOpacity className="border bg-slate-950 p-2 rounded-lg" onPress={onPressHandle_spinStatus}>
            <Text className="text-base text-center text-light_button_text font-semibold">Spin</Text>
          </TouchableOpacity>
        </View>
        <View className="m-2" />
        <View className="w-72">
          <Text style={{ textAlign: "center" }}>Veto count:{isVetoed}</Text>
          <View pointerEvents={`${!isVetoed ? "none" : "auto"}`}>
            <TouchableOpacity className="border bg-slate-950 p-2 rounded-lg" onPress={onPressHandle_veto}>
              <Text className="text-base text-center text-light_button_text font-semibold">Veto</Text>
            </TouchableOpacity>
          </View>
          <View className="m-3" />
          {/* <TouchableOpacity className="border bg-light_button_background p-2 rounded-lg">
            <Text className="text-base text-center text-light_button_text font-semibold">Select</Text>
          </TouchableOpacity> */}
        </View>

        {/* Below is temp content */}
        <View className="m-5" />
        <TouchableOpacity onPress={onPressHandle_navActivities} className="border">
          <Text>Go to activities Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressHandle_navInspiration} className="border">
          <Text>Go to inspiration Screen</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const images = [
  { uri: "https://picsum.photos/seed/picsum1/500/600", name: "test1" },
  { uri: "https://picsum.photos/seed/picsum2/500/600", name: "test2" },
  { uri: "", name: "test3" },
  { uri: null, name: "test4" },
  { uri: undefined, name: "test5" },
  { uri: "https://picsum.photos/seed/picsum6/500/600", name: "test6" },
  { uri: "https://picsum.photos/seed/picsum7/500/600", name: "test7" },
  { uri: "https://picsum.photos/seed/picsum8/500/600", name: "test8" },
  { uri: "", name: "test9" },
  { uri: "https://picsum.photos/seed/picsum10/500/600", name: "test10" },
  { uri: "https://picsum.photos/seed/picsum11/500/600", name: "test11" },
  { uri: "https://picsum.photos/seed/picsum12/500/600", name: "test12" },
  { uri: "https://picsum.photos/seed/picsum13/500/600", name: "test13" },
  { uri: null, name: "test14" },
  { uri: "https://picsum.photos/seed/picsum15/500/600", name: "test15" },
  { uri: "https://picsum.photos/seed/picsum16/500/600", name: "test16" },
  { uri: "https://picsum.photos/seed/picsum17/500/600", name: "test17" },
  { uri: "https://picsum.photos/seed/picsum18/500/600", name: "test18" },
  { uri: null, name: "test19" },
  { uri: "https://picsum.photos/seed/picsum20/500/600", name: "test20" },
];
