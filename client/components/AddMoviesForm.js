import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { postUserEntryToCategory, addMovie } from "../api";
import { auth } from "../firebase";

const AddMoviesForm = ({ onClose, onAddMovie }) => {
  const [movieName, setMovieName] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = async () => {
    if (!movieName || !genre) {
      Alert.alert(`Error, please fill in all fields`);
      return;
    }

    const newMovie = await addMovie(movieName, genre);
    console.log("new movie>>>>>>>>>", newMovie);
    const newMovieId = newMovie.data._id;
    console.log("new Id >>>>>>>>>>>>", newMovieId);

    const newEntry = {
      title: movieName,
      genre: genre,
    };

    const user = auth.currentUser;
    if (user) {
      const tempId = new Date().toISOString();
      const optimisticEntry = { ...newEntry, _id: tempId };
      onAddMovie(optimisticEntry);

      try {
        const addedEntry = await postUserEntryToCategory(user.uid, "user_films", newMovieId);
        onAddMovie((prevMovies) => prevMovies.map((movie) => (movie._id === tempId ? addedEntry : movie)));
        onClose();
      } catch (error) {
        console.error("Error adding movie", error);
        Alert.alert(`Error, something went wrond while adding movie`);
        onAddMovie((prevMovies) => prevMovies.filter((movie) => movie._id !== tempId));
      }
    }
  };
  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ padding: 20, backgroundColor: "white", borderRadius: 10, width: "80%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add a New Movie</Text>
        <TextInput
          placeholder="Movie Name"
          value={movieName}
          onChangeText={setMovieName}
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
          <Text style={{ color: "white", fontWeight: "bold" }}>Add Movie</Text>
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

export default AddMoviesForm;
