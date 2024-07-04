import React, { useCallback, useState } from "react";
import { View, Image, Dimensions, Text } from "react-native";
import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");
const scale = 0.7;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = 240 * scale;

const tempImage = require("../assets/placeholder_img.png");

export default function TestScreen() {
  const animationStyle = useCallback((value) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
    const translateX = interpolate(value, [-1, 0, 1], [-window.width, 0, window.width]);

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);

  const [imageUris, setImageUris] = useState(images);

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        style={{
          width: window.width,
          height: 240,
          justifyContent: "center",
          alignItems: "center",
        }}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        autoPlay={true}
        autoPlayInterval={100}
        scrollAnimationDuration={100}
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
    </View>
  );
}

const images = [
  { uri: "https://picsum.photos/seed/picsum1/500/300", name: "test1" },
  { uri: "https://picsum.photos/seed/picsum2/500/300", name: "test2" },
  { uri: "", name: "test3" },
  { uri: null, name: "test4" },
  { uri: undefined, name: "test5" },
  { uri: "https://picsum.photos/seed/picsum6/500/300", name: "test6" },
  { uri: "https://picsum.photos/seed/picsum7/500/300", name: "test7" },
  { uri: "https://picsum.photos/seed/picsum8/500/300", name: "test8" },
  { uri: "", name: "test9" },
  { uri: "https://picsum.photos/seed/picsum10/500/300", name: "test10" },
  { uri: "https://picsum.photos/seed/picsum11/500/300", name: "test11" },
  { uri: "https://picsum.photos/seed/picsum12/500/300", name: "test12" },
  { uri: "https://picsum.photos/seed/picsum13/500/300", name: "test13" },
  { uri: null, name: "test14" },
  { uri: "https://picsum.photos/seed/picsum15/500/300", name: "test15" },
  { uri: "https://picsum.photos/seed/picsum16/500/300", name: "test16" },
  { uri: "https://picsum.photos/seed/picsum17/500/300", name: "test17" },
  { uri: "https://picsum.photos/seed/picsum18/500/300", name: "test18" },
  { uri: null, name: "test19" },
  { uri: "https://picsum.photos/seed/picsum20/500/300", name: "test20" },
];
