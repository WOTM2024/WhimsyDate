import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon, MinusIcon, PlusCircleIcon } from "react-native-heroicons/outline";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import {
  fetchActivities,
  fetchFoods,
  fetchMovies,
  fetchTvShows,
  fetchUserByUID,
  patchUserEntriesByEntryId,
} from "../api";
import AddActivityForm from "../components/AddActivityForm";
import AddMoviesForm from "../components/AddMoviesForm";
import AddTvShowsForm from "../components/AddTvShowsForm";
import AddFoodsForm from "../components/AddFoodsForm";

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
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;
          const userResponse = await fetchUserByUID(userId);
          const userData = userResponse.data.data;

          const activities = await fetchActivities();
          const foods = await fetchFoods();
          const tvShows = await fetchTvShows();
          const movies = await fetchMovies();

          const filteredActivities = activities.filter((activity) => userData.user_activities.includes(activity._id));
          const filteredFoods = foods.filter((food) => userData.user_food_choices.includes(food._id));
          const filteredTvShows = tvShows.filter((tvShow) => userData.user_tv_shows.includes(tvShow._id));
          const filteredMovies = movies.filter((movie) => userData.user_films.includes(movie._id));

          setUserActivities(filteredActivities);
          setUserFoods(filteredFoods);
          setUserTvShows(filteredTvShows);
          setUserMovies(filteredMovies);

          setFilteredData([...filteredActivities, ...filteredFoods, ...filteredTvShows, ...filteredMovies]);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // console.log(userFoods);
    console.log("refreshed");
  }, [isModalVisible]);

  const handleRemoveItem = async (category, entryId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        switch (category) {
          case "user_activities":
            setUserActivities((prev) => {
              const newActivities = prev.filter((item) => item._id !== entryId);

              return newActivities;
            });
            break;
          case "user_food_choices":
            setUserFoods((prev) => {
              const newFoods = prev.filter((item) => item._id !== entryId);

              return newFoods;
            });
            break;
          case "user_tv_shows":
            setUserTvShows((prev) => {
              const newTvShows = prev.filter((item) => item._id !== entryId);

              return newTvShows;
            });
            break;
          case "user_films":
            setUserMovies((prev) => {
              const newMovies = prev.filter((item) => item._id !== entryId);

              return newMovies;
            });
            break;
          default:
            console.error(`Unknown category: ${category}`);
            break;
        }
        await patchUserEntriesByEntryId(user.uid, category, entryId);
      }
    } catch (err) {
      console.error("Error removing item", err);
      fetchUserData();
    }
  };

  const handleAddActivity = (newActivity) => {
    setUserActivities((prev) => [...prev, newActivity]);
    setFilteredData((prev) => [...prev, newActivity]);
  };

  const handleAddMovie = (newMovie) => {
    setUserMovies((prev) => [...prev, newMovie]);
    setFilteredData((prev) => [...prev, newMovie]);
  };

  const handleAddTvShows = (newShow) => {
    setUserTvShows((prev) => [...prev, newShow]);
    setFilteredData((prev) => [...prev, newShow]);
  };

  const handleAddFood = (newFood) => {
    setUserFoods((prev) => [...prev, newFood]);
    setFilteredData((prev) => [...prev, newFood]);
  };

  React.useEffect(() => {
    const combinedData = [...userActivities, ...userFoods, ...userTvShows, ...userMovies];

    if (searchForQuery === "") {
      setFilteredData(combinedData);
    } else {
      const query = searchForQuery.toLowerCase();
      const filtered = combinedData.filter((item) => {
        const name = item.activity_name || item.food_name || item.show || item.film || "";
        return name.toLowerCase().includes(query);
      });
      setFilteredData(filtered);
    }
  }, [searchForQuery, userActivities, userFoods, userTvShows, userMovies]);

  // function onPressHandle_searchActivities() {
  //   console.log("Pressed Search");
  // }

  // function onPressHandle_removeActivity(itemName) {
  //   console.log("Pressed Remove", itemName);
  // }

  // function onPressHandle_addActivity(itemName) {
  //   console.log("Pressed add activity");
  // }

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

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center ">
        <View className="m-10"></View>
        <View className="w-full items-center p-1">
          <View className="w-full flex-row items-center my-2 border-2 border-light_border border- rounded-md p-1">
            <TextInput
              placeholder="Search an activity"
              keyboardType="default"
              className="flex-1 p-1 mx-2"
              value={searchForQuery}
              onChangeText={(text) => setSearchForQuery(text)}
            />
            {/* <MagnifyingGlassIcon
              size={25}
              color="#1E1E1E"
              className="ml-2"
              // onPress={onPressHandle_searchActivities}
            /> */}
          </View>
        </View>
        <ScrollView className="w-full p-1">
          {/* Render the list of activities */}
          <Text className="text-xl font-bold pl-4">Activities</Text>
          {filteredData.map((item, index) => {
            // console.log(item);
            if (item.activity_name) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.activity_name}</Text>
                  <MinusIcon
                    size={30}
                    strokeWidth={3}
                    color="#1E1E1E"
                    className="ml-2"
                    onPress={() => handleRemoveItem("user_activities", item._id)}
                  />
                </View>
              );
            }
            return null;
          })}

          {/* Render the list of foods */}
          <Text className="text-xl font-bold pl-4">Foods</Text>
          {filteredData.map((item, index) => {
            if (item.food) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.food}</Text>
                  <MinusIcon
                    size={30}
                    strokeWidth={3}
                    color="#1E1E1E"
                    className="ml-2"
                    onPress={() => handleRemoveItem("user_food_choices", item._id)}
                  />
                </View>
              );
            }
            return null;
          })}

          {/* Render the list of TV shows */}
          <Text className="text-xl font-bold pl-4">TV Shows</Text>
          {filteredData.map((item, index) => {
            if (item.show) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.show}</Text>
                  <MinusIcon
                    size={30}
                    strokeWidth={3}
                    color="#1E1E1E"
                    className="ml-2"
                    onPress={() => handleRemoveItem("user_tv_shows", item._id)}
                  />
                </View>
              );
            }
            return null;
          })}

          {/* Render the list of movies */}
          <Text className="text-xl font-bold pl-4">Movies</Text>
          {filteredData.map((item, index) => {
            if (item.title) {
              return (
                <View
                  key={index}
                  className="flex-row items-center justify-between border-2 border-slate-500 p-3 m-2 rounded-xl"
                >
                  <Text className="flex-1 font-bold text-light_text text-lg">{item.title}</Text>
                  <MinusIcon
                    size={30}
                    strokeWidth={3}
                    color="#1E1E1E"
                    className="ml-2"
                    onPress={() => handleRemoveItem("user_films", item._id)}
                  />
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
        <View>
          <PlusCircleIcon fill="#D9D9D9" size={65} color="#4C25A2" onPress={() => setIsModalVisible(true)} />
        </View>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        {/* <AddActivityForm onClose={() => setIsModalVisible(false)} onAddActivity={handleAddActivity} />
        <AddMoviesForm onClose={() => setIsModalVisible(false)} onAddMovie={handleAddMovie} /> */}
        {/* <AddTvShowsForm onClose={() => setIsModalVisible(false)} onAddShow={handleAddTvShows} /> */}
        <AddFoodsForm onClose={() => setIsModalVisible(false)} onAddFood={handleAddFood} />
      </Modal>
    </LinearGradient>
  );
}
