import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { postUserEntryToCategory, addShow } from "../api";
import { auth } from "../firebase";

const AddTvShowsForm = ({ onClose, onAddShow }) => {
  const [showName, setShowName] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = async () => {
    if (!showName || !genre) {
      Alert.alert(`Error, please fill in all fields`);
      return;
    }

    const newShow = await addShow(showName, genre);
    console.log("new show >>>>>>>>>", newShow);
    const newShowId = newShow.data._id;
    console.log("new Id >>>>>>>>>>>>", newShowId);

    const newEntry = {
      show: showName,
      genre: genre,
    };

    const user = auth.currentUser;
    if (user) {
      const tempId = new Date().toISOString();
      const optimisticEntry = { ...newEntry, _id: tempId };
      onAddShow(optimisticEntry);

      try {
        const addedEntry = await postUserEntryToCategory(user.uid, "user_tv_shows", newShowId);
        onAddShow((prevShows) => prevShows.map((show) => (show._id === tempId ? addedEntry : show)));
        onClose();
      } catch (error) {
        console.error("Error adding show", error);
        Alert.alert(`Error, something went wrong while adding tv show`);
        onAddShow((prevShows) => prevShows.filter((show) => show._id !== tempId));
      }
    }
  };
  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ padding: 20, backgroundColor: "white", borderRadius: 10, width: "80%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add a New Show</Text>
        <TextInput
          placeholder="Show Name"
          value={showName}
          onChangeText={setShowName}
          style={{ borderWidth: 2, borderColor: "gray", marginVertical: 20, padding: 8, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Genre Name"
          value={genre}
          onChangeText={setGenre}
          style={{ borderWidth: 2, borderColor: "gray", marginBottom: 10, padding: 8, borderRadius: 5 }}
        />
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
          <Text style={{ color: "white", fontWeight: "bold" }}>Add Show</Text>
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

export default AddTvShowsForm;
