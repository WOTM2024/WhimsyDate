import React from "react";
import { Image, StyleSheet, Dimensions, ImageBackground } from "react-native";

const { width, height } = Dimensions.get("window");

const Background = ({ children }) => {
  return (
    <ImageBackground source={require("../../assets/FlappyBackground.png")} style={styles.background}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height,
    position: "absolute",
  },
});

export default Background;
