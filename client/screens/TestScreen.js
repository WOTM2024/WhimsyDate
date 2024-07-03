// TestScreen.js
import * as React from "react";
import { View, Text, Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export default function TestScreen() {
  const width = Dimensions.get("window").width;
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={images}
        autoPlayInterval={3}
        scrollAnimationDuration={150}
        onSnapToItem={(index) => console.log("current index:", index)}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%", resizeMode: "cover" }} />
          </View>
        )}
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
