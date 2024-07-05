// ActivitiesScreen.js
import * as React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon, MinusIcon, PlusCircleIcon } from "react-native-heroicons/outline";
import { LinearGradient } from "expo-linear-gradient";
import { fetchActivities } from "../api";

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const [activities, setActivities] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [category, setCategory] = React.useState('');
  const [isCollaborative, setIsCollaborative] = React.useState('');
  const [cost, setCost] = React.useState('');
  
  React.useEffect(() => {
    fetchActivities(category, isCollaborative, cost)
      .then((activitiesFromApi) => {
        console.log(activitiesFromApi, "activities from api ")
        setActivities(activitiesFromApi || []);
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
        <View className="w-full items-center p-1">
          <View className="w-full flex-row items-center m-2 border border-light_border border-2 rounded-md ">
            <TextInput placeholder="Search an activity" keyboardType="default" className="flex-1 p-1 mx-2" />
            <MagnifyingGlassIcon size={25} color="#1E1E1E" className="ml-2" onPress={onPressHandle_searchActivities} />
          </View>
        </View>
        <ScrollView className="w-full p-1 ">
          {activities.map((activity, index) => {
            return (
              <View key={activity._id} className="flex-row items-center justify-between border p-3 m-2 rounded-xl">
                <Text className="flex-1 font-bold text-light_text text-lg">{activity.activity_name}</Text>
                <MinusIcon
                  size={25}
                  color="#1E1E1E"
                  className="ml-2"
                  onPress={() => onPressHandle_removeActivity(item)}
                />
              </View>
            );
          })}
        </ScrollView>
        <View>
          <PlusCircleIcon size={75} color="#1E1E1E" onPress={onPressHandle_addActivity} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const tempDate = [
  "Sushi",
  "Chinese",
  "Indian",
  "Kebab",
  "Thai",
  "Jamaican",
  "Italian",
  "Fast Food",
  "Rock Climbing",
  "Swimming",
  "Badminton",
  "Football",
  "Basketball",
  "Netflix & Chill",
  "Movies",
  "TV Shows",
  "Hiking",
  "Camping",
  "Biking",
  "Picnic",
  "Board Games",
  "Video Games",
  "Reading",
  "Painting",
  "Drawing",
  "Cooking",
  "Baking",
  "Photography",
  "Yoga",
  "Pilates",
  "Meditation",
  "Gardening",
  "Birdwatching",
  "Volunteering",
];
