// WelcomeScreen.js
import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
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

  const categories = [{category_name: "Activities", path_name:"user_activities"}, {category_name:"Food", path_name:"user_food_choices"}, {category_name:"Films", path_name:"user_films"}, {category_name:"Tv Shows", path_name:"user_tv_shows"}]


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

  const handleActivityNavigation = (categoryObj) => {
    navigation.navigate("Roulette", { categoryObj });
  };

  return (
    <LinearGradient
      colors={["#D9D9D9", "#B999FF", "#D9D9D9"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 items-center justify-center">
        <View className="m-4" />
        <View>
          <Text className="m-4 text-center text-6xl text-light_text font-bold">
            Welcome
          </Text>
          <Text className="text-center text-6xl text-light_text font-bold">
            {username}!
          </Text>
          <View className="p-4"/>
          <Text className="text-center text-2xl text-light_text font-medium font-semibold">
            Choose an activity category
          </Text>
        </View>
        <View/>
        <View className="mt-16 flex-row items-center">
          <TouchableOpacity
            onPress={handlePrev}
            className="mt-8"
          >
            <ChevronLeftIcon size={50} color="#4C25A2" strokeWidth="3"/>
          </TouchableOpacity>
          {/* <Image source={{ uri: "https://picsum.photos/300" }} className="w-72 h-72 rounded-xl" /> */}
          <View className="w-72 h-72 rounded-xl items-center">
            <Carousel
              ref={carouselRef}
              width={PAGE_WIDTH * 0.7}
              height={PAGE_WIDTH * 0.9}
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
                    <TouchableOpacity
                      className="flex-1 justify-center items-center bg-slate-900 rounded-md border-4 border-neutral-1000"
                      onPress={() =>
                        handleActivityNavigation(categories[index])
                      }
                    >
                      <ImageBackground className="flex-1 items-center justify-center" style={{width:"100%", height: "100%"}} source={image} resizeMode="cover" >
                      </ImageBackground>
                    </TouchableOpacity>
                      <Text className="text-light_text" style={{ paddingTop: 10, fontSize: 30, fontWeight: "00", textAlign:"center", fontWeight: "700"}}>
                        {categories[index].category_name}
                      </Text>
                  </View>
                );
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className="mt-8"
          >
            <ChevronRightIcon size={50} color="#4C25A2" strokeWidth="3"/>
          </TouchableOpacity>
        </View>
        <View>
          {/* <Text className="text-2xl text-light_text font-semibold">{displayText}</Text> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const images = [
  { uri: "https://images.unsplash.com/photo-1593739742226-5e5e2fdb1f1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "test1" },
  { uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "test2" },
  { uri: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "test3" },
  { uri: "https://images.unsplash.com/photo-1580247817119-c6cb496270a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHR2JTIwc2hvd3N8ZW58MHx8MHx8fDA%3D", name: "test4" },
];
