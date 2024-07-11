import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { postUserEntryToCategory, addFood } from "../api";
import { auth } from "../firebase";

const AddFoodsForm = ({ onClose, onAddFood }) => {
  const [foodName, setFoodName] = useState("");
  const [isVegetarian, setIsVegetarian] = useState("");
  const [isVegan, setIsVegan] = useState(false);
  const [isMeat, setIsMeat] = useState(false);
  const [isAllergies, setIsAllergies] = useState(false);

  const handleSubmit = async () => {
    if (!foodName || !isVegetarian || !isVegan || !isMeat || !isAllergies) {
      Alert.alert(`Error, please fill in all fields`);
      return;
    }

    const newFood = await addFood(foodName, isVegetarian, isVegan, isMeat, isAllergies);
    console.log("new activity>>>>>>>>>", newFood);
    const newFoodId = newFood.data._id;
    console.log("new Id >>>>>>>>>>>>", newFoodId);

    const newEntry = {
      food: foodName,
      vegetarian: isVegetarian,
      vegan: isVegan,
      meat: isMeat,
      allergies: isAllergies,
    };

    const user = auth.currentUser;
    if (user) {
      const tempId = new Date().toISOString();
      const optimisticEntry = { ...newEntry, _id: tempId };
      onAddFood(optimisticEntry);

      try {
        const addedEntry = await postUserEntryToCategory(user.uid, "user_food_choices", newFoodId);
        onAddFood((prevFoods) => prevFoods.map((food) => (food._id === tempId ? addedEntry : food)));
        onClose();
      } catch (error) {
        console.error("Error adding food", error);
        Alert.alert(`Error, something went wrong while adding food`);
        onAddFood((prevFoods) => prevFoods.filter((food) => food._id !== tempId));
      }
    }
  };
  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ padding: 20, backgroundColor: "white", borderRadius: 10, width: "80%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add a New Food</Text>
        <TextInput
          placeholder="Food Name"
          value={foodName}
          onChangeText={setFoodName}
          style={{ borderWidth: 2, borderColor: "gray", marginVertical: 20, padding: 8, borderRadius: 5 }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            paddingLeft: 5,
          }}
        >
          <Text>Vegetarian:</Text>
          <Switch value={isVegetarian} onValueChange={setIsVegetarian} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            paddingLeft: 5,
          }}
        >
          <Text>Vegan:</Text>
          <Switch value={isVegan} onValueChange={setIsVegan} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            paddingLeft: 5,
          }}
        >
          <Text>Meat:</Text>
          <Switch value={isMeat} onValueChange={setIsMeat} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            paddingLeft: 5,
          }}
        >
          <Text>Allergies:</Text>
          <Switch value={isAllergies} onValueChange={setIsAllergies} />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#B999FF",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            marginVertical: 10,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Add Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "red",
            padding: 10,
            marginVertical: 20,
            borderRadius: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AddFoodsForm;
