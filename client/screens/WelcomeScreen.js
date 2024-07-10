// WelcomeScreen.js
import React, { useRef, useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, SafeAreaView, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { ChevronLeftIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { fetchUserByUID } from "../api";
import { UserContext } from "../contexts/UserContext";
const { width: PAGE_WIDTH } = Dimensions.get("window");

// https://heroicons.com/outline
// https://unpkg.com/browse/@heroicons/vue@2.1.4/24/outline/
// https://tailwindcss.com/docs
// https://react-native-reanimated-carousel.vercel.app/

export default function WelcomeScreen() {
  const navigation = useNavigation();
  // const { username } = useContext(UserContext);
  // console.log("WelcomeScreen - Username:", username); // Debugging line
  const carouselRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayText, setDisplayText] = useState(images[0].name);
  const [isNavigating, setIsNavigating] = useState(false);

  ///////////////////
  // Temp Demo
  //////////////////

  const [username, setUsername] = useState("");

  useEffect(() => {
    // console.log(auth.currentUser?.uid);
    fetchUserByUID(auth.currentUser?.uid)
      .then(({ data }) => {
        // console.log(response.data.data.username);
        setUsername(data.data.username);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /////////////////

  const categories = [{category_name: "activities", path_name:"user_activities"}, {category_name:"food", path_name:"user_food_choices"}, {category_name:"films", path_name:"user_films"}, {category_name:"tv shows", path_name:"user_tv_shows"}]

  const handleSnapToItem = (index) => {
    setCurrentImageIndex(index);
    setDisplayText(images[index].name);
  };

  const handlePrev = () => {
    if (carouselRef.current && !isNavigating) {
      setIsNavigating(true);
      carouselRef.current.prev();
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setDisplayText(images[currentImageIndex - 1].name);
      }
      setTimeout(() => setIsNavigating(false), 400);
    }
  };

  const handleNext = () => {
    if (carouselRef.current && !isNavigating) {
      setIsNavigating(true);
      carouselRef.current.next();
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setDisplayText(images[currentImageIndex + 1].name);
      }
      setTimeout(() => setIsNavigating(false), 400);
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      // navigation.replace("Login");
      navigation.navigate("Login");
    });
  };

  const handleActivityNavigation = (categoryObj) => {
    navigation.navigate("Home", { categoryObj });
  }

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center ">
        <View className="m-12" />
        <View>
          <Text className="text-center text-7xl text-light_text font-bold">Welcome</Text>
          <Text className="text-center text-7xl text-light_text font-bold">{username}!</Text>
          <View className="m-2" />
          <Text className="text-center text-3xl text-light_text font-medium">Choose an activity category</Text>
        </View>
        <View className="m-2" />
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handlePrev} className="rounded-full bg-gray-800/30">
            <ChevronLeftIcon size={40} color="#FFFFFF" />
          </TouchableOpacity>
          {/* <Image source={{ uri: "https://picsum.photos/300" }} className="w-72 h-72 rounded-xl" /> */}
          <View className="w-72 h-72 rounded-xl items-center">
            <Carousel
              ref={carouselRef}
              width={PAGE_WIDTH * 0.7}
              height={PAGE_WIDTH * 0.7}
              loop={true}
              snapEnabled={true}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              data={categories}
              // autoPlay={true}
              // autoPlayInterval={30}
              scrollAnimationDuration={300}
              onSnapToItem={handleSnapToItem}
              renderItem={({ index }) => {
                const image = images[index];
                return (
                  <View className="flex-1">
                    {/* {image.uri ? (
                      <Image source={{ uri: image.uri }} className="w-full h-full rounded-md" resizeMode="cover" />
                    ) : (
                      <TouchableOpacity className="flex-1 justify-center items-center bg-gray-400 rounded-md" >
                        <Text style={{ color: "#FFFFFF" }}>Image not available</Text>
                      </TouchableOpacity>
                    )} */}
                    <TouchableOpacity className="flex-1 justify-center items-center bg-slate-900 rounded-md border-4 border-neutral-50" onPress={() => handleActivityNavigation(categories[index])}>
                        <Text style={{ color: "#FFFFFF", fontSize: 30 }}>{categories[index].category_name}</Text>
                      </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          <TouchableOpacity onPress={handleNext} className="rounded-full bg-gray-800/30">
            <ChevronRightIcon size={40} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {/* <View> */}
          {/* <Text className="text-2xl text-light_text font-semibold">{displayText}</Text> */}
        {/* </View> */}

        {/* Below is temp content */}
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

const images = [
  { uri: "https://picsum.photos/seed/picsum1/500/600", name: "test1" },
  { uri: "https://picsum.photos/seed/picsum2/500/600", name: "test2" },
  { uri: "https://picsum.photos/seed/picsum3/500/600", name: "test3" },
  { uri: "https://picsum.photos/seed/picsum4/500/600", name: "test4" },
];
