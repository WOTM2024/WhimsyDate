// HomeScreen.js
import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");
const scale = 0.7;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = 500 * scale;

const tempImage = require("../assets/placeholder_img.png");

export default function HomeScreen() {
  const navigation = useNavigation();
  function onPressHandle_navTieBreaker() {
    navigation.navigate("Tie Breaker");
  }
  function onPressHandle_navActivities() {
    navigation.navigate("Activities");
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

  const [isSpinning, setIsSpinning] = useState(false);

  function onPressHandle_spinStatus() {
    setIsSpinning(!isSpinning);
  }

  const [imageUris, setImageUris] = useState(images);
  return (
    <LinearGradient colors={["#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <View className="flex-1 items-center ">
        {/* <Text>Home</Text> */}
        <View className="m-5" />
        <Text className="text-3xl font-semibold">Swipe left/right to spin</Text>
        <View className="m-2" />

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
          data={imageUris}
          onSnapToItem={(index) => console.log("current index:", index)}
          renderItem={({ index }) => {
            const imageSource = imageUris[index].uri ? { uri: imageUris[index].uri } : tempImage;
            return (
              <View key={index} style={{ flex: 1, alignItems: "center" }}>
                <Image
                  source={imageSource}
                  style={{
                    width: PAGE_WIDTH,
                    height: PAGE_HEIGHT,
                  }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>{imageUris[index].name}</Text>
              </View>
            );
          }}
          customAnimation={animationStyle}
        />
        <View>
          <TouchableOpacity className="border bg-slate-950 p-2 rounded-lg" onPress={onPressHandle_spinStatus}>
            {!isSpinning ? (
              <Text className="text-base text-center text-light_button_text font-semibold">Spin</Text>
            ) : (
              <Text className="text-base text-center text-light_button_text font-semibold">Stop</Text>
            )}
          </TouchableOpacity>
        </View>
        <View className="m-2" />
        <View className="w-72">
          <TouchableOpacity className="border bg-slate-950 p-2 rounded-lg">
            <Text className="text-base text-center text-light_button_text font-semibold">Veto</Text>
          </TouchableOpacity>
          <View className="m-3" />
          <TouchableOpacity className="border bg-light_button_background p-2 rounded-lg">
            <Text className="text-base text-center text-light_button_text font-semibold">Select</Text>
          </TouchableOpacity>
        </View>

        {/* Below is temp content */}
        <View className="m-10" />
        <TouchableOpacity onPress={onPressHandle_navTieBreaker} className="border">
          <Text>Go to tie breaker Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressHandle_navActivities} className="border">
          <Text>Go to activities Screen</Text>
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
