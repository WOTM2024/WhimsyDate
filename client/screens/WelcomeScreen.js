// WelcomeScreen.js
import { useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";

// ICONS
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import { UserContext } from "../contexts/UserContext";
// https://heroicons.com/outline
// https://unpkg.com/browse/@heroicons/vue@2.1.4/24/outline/
// https://tailwindcss.com/docs

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { username } = useContext(UserContext);

  console.log("WelcomeScreen - Username:", username); // Debugging line

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <LinearGradient
      colors={["#D9D9D9", "#B999FF", "#D9D9D9"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 items-center ">
        <View className="m-5" />
        <View>
          <Text className="text-center text-7xl text-light_text font-bold">
            Welcome
          </Text>
          <Text className="text-center text-7xl text-light_text font-bold">
            {username}!
          </Text>
          <View className="m-2" />
          <Text className="text-center text-3xl text-light_text font-medium">
            Choose an activity category
          </Text>
        </View>
        <View className="m-2" />
        <View className="flex-row items-center">
          <ChevronLeftIcon size={40} color="#FFFFFF" />
          <Image
            source={{ uri: "https://picsum.photos/300" }}
            className="w-72 h-72 rounded-xl"
          />
          <ChevronRightIcon size={40} color="#FFFFFF" />
        </View>
        <View>
          <Text className="text-2xl text-light_text font-semibold">
            Eat Out/In
          </Text>
        </View>

        <View className="m-10" />
        <View>
          <TouchableOpacity onPress={handleSignOut} className="border">
            <Text>sign out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
