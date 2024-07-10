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
import { auth } from "../firebase";
import { fetchActivities, fetchFoods, fetchMovies, fetchTvShows, fetchUserByUID } from "../api";

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [searchForQuery, setSearchForQuery] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);
  const [userActivities, setUserActivities] = React.useState([]);
  const [userFoods, setUserFoods] = React.useState([]);
  const [userTvShows, setUserTvShows] = React.useState([]);
  const [userMovies, setUserMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;
          const userResponse = await fetchUserByUID(userId);
          const userData = userResponse.data.data;
          
          const activities = await fetchActivities()
          const foods = await fetchFoods()
          const tvShows = await fetchTvShows()
          const movies = await fetchMovies()

          const filteredActivities = activities.filter(activity => userData.user_activities.includes(activity._id));
          const filteredFoods = foods.filter(food => userData.user_food_choices.includes(food._id));
          const filteredTvShows = tvShows.filter(tvShow => userData.user_tv_shows.includes(tvShow._id));
          const filteredMovies = movies.filter(movie => userData.user_films.includes(movie._id));
          

          setUserActivities(filteredActivities);
          setUserFoods(filteredFoods);
          setUserTvShows(filteredTvShows);
          setUserMovies(filteredMovies);

          setFilteredData([
            ...filteredActivities,
            ...filteredFoods,
            ...filteredTvShows,
            ...filteredMovies,
          ]);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);  
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  

  React.useEffect(() => {
    if (searchForQuery === "") {
      const combinedData = [
        ...userActivities,
        ...userFoods,
        ...userTvShows,
        ...userMovies,
      ];
       
      setFilteredData(combinedData);
    } else {
      const query = searchForQuery.toLowerCase();
      setFilteredData(
        [...userActivities, ...userFoods, ...userTvShows, ...userMovies].filter(
          (item) => {
            const name =
              item.activity_name ||
              item.food_name ||
              item.tvshow_name ||
              item.movie_name ||
              "";
            return name.toLowerCase().includes(query);
          }
        )
      );
    }
  }, [searchForQuery, userActivities, userFoods, userTvShows, userMovies]);
  

  function onPressHandle_searchActivities() {
    console.log("Pressed Search");
  }

  function onPressHandle_removeActivity(itemName) {
    console.log("Pressed Remove", itemName);
  }

  function onPressHandle_addActivity(itemName) {
    console.log("Pressed add activity");
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error}</Text>
      </View>
    );
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
              value={searchForQuery}
              onChangeText={(text) => setSearchForQuery(text)}
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
        <Text className="text-xl font-bold">Activities</Text>
          {userActivities.map((activity, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
              >
                <Text className="flex-1 font-bold text-light_text text-lg">
                  {activity.activity_name || "Unknown Activity"}
                </Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() => onPressHandle_removeActivity(activity)}
                />
              </View>
            );
          })}
            <Text className="text-xl font-bold">Foods</Text>
          {userFoods.map((food, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
              >
                <Text className="flex-1 font-bold text-light_text text-lg">
                  {food.food_name || "Unknown Food"}
                </Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() => onPressHandle_removeActivity(food)}
                />
              </View>
            );
          })}
           <Text className="text-xl font-bold">TV Shows</Text>
          {userTvShows.map((tvShow, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
              >
                <Text className="flex-1 font-bold text-light_text text-lg">
                  {tvShow.show || "Unknown Show"}
                </Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() => onPressHandle_removeActivity(tvShow)}
                />
              </View>
            );
          })}
           <Text className="text-xl font-bold">Movies</Text>
          {userMovies.map((movie, index) => {
            return (
              <View
                key={index}
                className="flex-row items-center justify-between border p-3 m-2 rounded-xl"
              >
                <Text className="flex-1 font-bold text-light_text text-lg">
                  {movie.film || "Unknown Movie"}
                </Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() => onPressHandle_removeActivity(movie)}
                />
              </View>
            );
          })}
        </ScrollView>
        <View>
          <PlusCircleIcon
            size={75}
            color="#1E1E1E"
            onPress={onPressHandle_addActivity}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}



