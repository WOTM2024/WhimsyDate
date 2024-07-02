import * as React from "react";
import { Text, View, TouchableOpacity, SafeAreaView, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

// ICONS
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
// https://heroicons.com/outline
// https://unpkg.com/browse/@heroicons/vue@2.1.4/24/outline/

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const tempUser = "Bob";

  function onPressHandle_navHome() {
    navigation.navigate("Home");
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Welcome</Text>

        <Text>{tempUser}!</Text>
        <Text>Choose an activity category</Text>

        <View style={styles.center_image_container}>
          <ChevronLeftIcon size={40} color="#1E1E1E" />
          <Image source={{ uri: "https://picsum.photos/300" }} style={styles.image} />
          <ChevronRightIcon size={40} color="#1E1E1E" />
        </View>

        <View>
          <TouchableOpacity onPress={onPressHandle_navHome}>
            <Text>Go to home screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  center_image_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  image: {
    width: 250,
    height: 250,
  },
});
