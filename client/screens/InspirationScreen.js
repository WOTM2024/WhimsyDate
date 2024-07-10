// InspirationScreen.js
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
import { LinearGradient } from "expo-linear-gradient";
import { fetchActivities, fetchFoods, fetchMovies, fetchTvShows } from "../api";

export default function InspirationScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = React.useState([]);
  const [foods, setFoods] = React.useState([]);
  const [tvShows, setTvShows] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [category, setCategory] = React.useState("");
  const [isCollaborative, setIsCollaborative] = React.useState("");
  const [cost, setCost] = React.useState("");

  React.useEffect(() => {
    fetchActivities(category, isCollaborative, cost)
      .then((activitiesFromApi) => {
        console.log(activitiesFromApi, "activities from api ");
        setActivities(activitiesFromApi || []);
      })
      .catch((err) => {
        setError(err.response.data.msg || "An error occurred");
      });

    fetchFoods()
      .then((foodsFromApi) => {
        setFoods(foodsFromApi || []);
      })
      .catch((err) => {
        setError(err.response.data.msg || "An error occurred");
      });

    fetchTvShows()
      .then((tvShowsFromApi) => {
        setTvShows(tvShowsFromApi || []);
      })
      .catch((err) => {
        setError(err.response.data.msg || "An error occurred");
      });

    fetchMovies()
      .then((moviesFromApi) => {
        setMovies(moviesFromApi || []);
      })
      .catch((err) => {
        setError(err.response.data.msg || "An error occurred");
      });
  }, []);

  function onPressHandle_searchActivities() {
    console.log("Pressed Search");
  }

  function onPressHandle_removeActivity(itemName) {
    console.log("Pressed Remove", itemName);
  }

  function onPressHandle_addActivity(itemName) {
    console.log("Pressed add activity");
  }
  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center ">
        <View className="m-12"></View>
        <View className="w-full items-center p-1">
          <View className="w-full flex-row items-center m-2 border border-light_border border-2 rounded-md ">
            <TextInput
              placeholder="Search an activity"
              keyboardType="default"
              className="flex-1 p-1 mx-2"
            />
            <MagnifyingGlassIcon
              size={25}
              color="#1E1E1E"
              className="ml-2"
              onPress={onPressHandle_searchActivities}
            />
          </View>
        </View>
        <ScrollView className="w-full p-1 ">
          <Text className="text-xl font-bold mb-2">Activities</Text>
          {activities.map((activity, index) => {
            return (
              <View
                key={activity._id}
                className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
              >
                <Text className="flex-1 font-bold text-light_text text-lg">
                  {activity.activity_name}
                </Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() => onPressHandle_removeActivity(item)}
                />
              </View>
            );
          })}
          <Text className="text-xl font-bold mb-2">Foods</Text>
          {foods.map((food, index) => (
            <View
              key={food._id}
              className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
            >
              <Text className="flex-1 font-bold text-light_text text-lg">
                {food.food}
              </Text>
              <MinusIcon
                size={25}
                color="#1E1E1E"
                className="ml-2"
                onPress={() => onPressHandle_removeActivity(food.food_name)}
              />
            </View>
          ))}
          <Text className="text-xl font-bold mb-2">Tv Shows</Text>
          {tvShows.map((tvShow, index) => (
            <View
              key={tvShow._id}
              className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
            >
              <Text className="flex-1 font-bold text-light_text text-lg">
                {tvShow.show}
              </Text>
              <MinusIcon
                size={25}
                color="#1E1E1E"
                className="ml-2"
                onPress={() => onPressHandle_removeActivity(tvShow.show)}
              />
            </View>
          ))}
          <Text className="text-xl font-bold mb-2">Movies</Text>
          {movies.map((movie, index) => (
            <View
              key={movie._id}
              className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
            >
              <Text className="flex-1 font-bold text-light_text text-lg">
                {movie.film}
              </Text>
              <MinusIcon
                size={25}
                color="#1E1E1E"
                className="ml-2"
                onPress={() => onPressHandle_removeActivity(movie.title)}
              />
            </View>
          ))}
        </ScrollView>
        {/* <View>
          <PlusCircleIcon
            size={75}
            color="#1E1E1E"
            onPress={onPressHandle_addActivity}
          />
        </View> */}
      </SafeAreaView>
    </LinearGradient>
  );
}
