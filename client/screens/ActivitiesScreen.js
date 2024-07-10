import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  MagnifyingGlassIcon,
  MinusIcon,
  PlusCircleIcon,
} from "react-native-heroicons/outline";
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

          const filteredActivities = activities.filter((activity) =>
            userData.user_activities.includes(activity._id)
          );
          const filteredFoods = foods.filter((food) =>
            userData.user_food_choices.includes(food._id)
          );
          const filteredTvShows = tvShows.filter((tvShow) =>
            userData.user_tv_shows.includes(tvShow._id)
          );
          const filteredMovies = movies.filter((movie) =>
            userData.user_films.includes(movie._id)
          );

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

  React.useEffect(() => {
    const combinedData = [
      ...userActivities,
      ...userFoods,
      ...userTvShows,
      ...userMovies,
    ];

    if (searchForQuery === "") {
      setFilteredData(combinedData);
    } else {
      const query = searchForQuery.toLowerCase();
      setFilteredData(
        [...userActivities, ...userFoods, ...userTvShows, ...userMovies].filter(
          (item) => {
            const name =
              item.activity_name ||
              item.food_name ||
              item.show ||
              item.film ||
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

  // function onPressHandle_removeActivity(itemName) {
  //   console.log("Pressed Remove", itemName);
  // }

  // function onPressHandle_addActivity(itemName) {
  //   console.log("Pressed add activity");
  // }

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
                  onPress={() =>
                    handleRemoveItem("user_activities", activity._id)
                  }
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
                  {food.food || "Unknown Food"}
                </Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() =>
                    handleRemoveItem("user_food_choices", food._id)
                  }
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
                  onPress={() => handleRemoveItem("user_tv_shows", tvShow._id)}
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
                  onPress={() => handleRemoveItem("user_films", movie._id)}
                />
              </View>
            );
          })}
        </ScrollView>
        <View>
          <PlusCircleIcon
            size={75}
            color="#1E1E1E"
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <AddActivityForm
          onClose={() => setIsModalVisible(false)}
          onAddActivity={handleAddActivity}
        />
      </Modal>
    </LinearGradient>
  );
}
