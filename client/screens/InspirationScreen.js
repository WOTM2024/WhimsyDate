// InspirationScreen.js
import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon, MinusIcon, PlusCircleIcon } from "react-native-heroicons/outline";
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
  const [searchForQuery, setSearchForQuery] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesPromise = fetchActivities(category, isCollaborative, cost).then((activitiesFromApi) => {
          // console.log(activitiesFromApi, "activities from api ");
          setActivities(activitiesFromApi || []);
          setFilteredData(activitiesFromApi || []);
        });

        const foodsPromise = fetchFoods().then((foodsFromApi) => {
          setFoods(foodsFromApi || []);
        });

        const tvShowsPromise = fetchTvShows().then((tvShowsFromApi) => {
          setTvShows(tvShowsFromApi || []);
        });

        const moviesPromise = fetchMovies().then((moviesFromApi) => {
          setMovies(moviesFromApi || []);
        });

        await Promise.all([activitiesPromise, foodsPromise, tvShowsPromise, moviesPromise]);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [category, isCollaborative, cost]);

  React.useEffect(() => {
    const combinedData = [...activities, ...foods, ...tvShows, ...movies];

    if (searchForQuery === "") {
      setFilteredData(combinedData);
    } else {
      const query = searchForQuery.toLowerCase();
      const filtered = combinedData.filter((item) => {
        const name = item.activity_name || item.food || item.show || item.title || "";
        return name.toLowerCase().includes(query);
      });
      setFilteredData(filtered);
    }
  }, [searchForQuery, activities, foods, tvShows, movies]);

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text className="text-2xl">Loading...</Text>
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

  // function onPressHandle_searchActivities() {
  //   console.log("Pressed Search");
  // }

  // function onPressHandle_removeActivity(itemName) {
  //   console.log("Pressed Remove", itemName);
  // }

  // function onPressHandle_addActivity(itemName) {
  //   console.log("Pressed add activity");
  // }

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center ">
        <View className="m-10"></View>
        <View className="w-full items-center p-1">
          <View className="w-full flex-row items-center m-2 border border-light_border border-4 rounded-md p-1">
            <TextInput
              placeholder="Search an activity"
              keyboardType="default"
              className="flex-1 p-1 mx-2"
              value={searchForQuery}
              onChangeText={(text) => setSearchForQuery(text)}
            />
          </View>
        </View>
        <ScrollView className="w-full p-1 ">
          <Text className="text-xl font-bold mb-2 pl-4">Activities</Text>
          {filteredData.map((item, index) => {
            if (item.activity_name) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.activity_name}</Text>
                </View>
              );
            }
            return null;
          })}
          <Text className="text-xl font-bold mb-2 pl-4">Foods</Text>
          {filteredData.map((item, index) => {
            if (item.food) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.food}</Text>
                </View>
              );
            }
            return null;
          })}
          <Text className="text-xl font-bold mb-2 pl-4">TV Shows</Text>
          {filteredData.map((item, index) => {
            if (item.show) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.show}</Text>
                </View>
              );
            }
            return null;
          })}
          <Text className="text-xl font-bold mb-2 pl-4">Movies</Text>
          {filteredData.map((item, index) => {
            if (item.title) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.title}</Text>
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
