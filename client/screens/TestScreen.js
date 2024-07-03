import React from "react";
import { View, Image, Dimensions } from "react-native";
import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");
const scale = 0.7;
const PAGE_WIDTH = window.width * scale;
const PAGE_HEIGHT = 240 * scale;

export default function TestScreen() {
  const animationStyle = React.useCallback((value) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
    const translateX = interpolate(value, [-1, 0, 1], [-window.width, 0, window.width]);

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);

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
        autoPlayInterval={300}
        scrollAnimationDuration={300}
        data={images}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ index }) => {
          return (
            <View key={index}>
              <Image
                source={{ uri: images[index].uri }}
                style={{
                  width: PAGE_WIDTH,
                  height: PAGE_HEIGHT,
                }}
              />
            </View>
          );
        }}
        customAnimation={animationStyle}
      />
    </View>
  );
}

const images = [
  { uri: "https://picsum.photos/seed/picsum1/500/300" },
  { uri: "https://picsum.photos/seed/picsum2/500/300" },
  { uri: "https://picsum.photos/seed/picsum3/500/300" },
  { uri: "https://picsum.photos/seed/picsum4/500/300" },
  { uri: "https://picsum.photos/seed/picsum5/500/300" },
  { uri: "https://picsum.photos/seed/picsum6/500/300" },
  { uri: "https://picsum.photos/seed/picsum7/500/300" },
  { uri: "https://picsum.photos/seed/picsum8/500/300" },
  { uri: "https://picsum.photos/seed/picsum9/500/300" },
  { uri: "https://picsum.photos/seed/picsum10/500/300" },
  { uri: "https://picsum.photos/seed/picsum11/500/300" },
  { uri: "https://picsum.photos/seed/picsum12/500/300" },
  { uri: "https://picsum.photos/seed/picsum13/500/300" },
  { uri: "https://picsum.photos/seed/picsum14/500/300" },
  { uri: "https://picsum.photos/seed/picsum15/500/300" },
  { uri: "https://picsum.photos/seed/picsum16/500/300" },
  { uri: "https://picsum.photos/seed/picsum17/500/300" },
  { uri: "https://picsum.photos/seed/picsum18/500/300" },
  { uri: "https://picsum.photos/seed/picsum19/500/300" },
  { uri: "https://picsum.photos/seed/picsum20/500/300" },
];
