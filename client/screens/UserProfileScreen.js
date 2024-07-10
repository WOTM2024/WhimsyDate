import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, SafeAreaView, Image, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import { deleteUserByUID, fetchUserByUID } from "../api";
import { deleteUser } from "firebase/auth";

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleDeleteAccount = () => {
    const currentUser = auth.currentUser;
    const currentUserId = auth.currentUser?.uid;
    Promise.all([deleteUser(currentUser), deleteUserByUID(currentUserId)]).then((response) => {
      console.log(response);
      navigation.navigate("Login");
    });
  };

  useEffect(() => {
    console.log(auth.currentUser?.uid);
    fetchUserByUID(auth.currentUser?.uid)
      .then(({ data }) => {
        // console.log(response.data.data.username);
        setUsername(data.data.username);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      // navigation.replace("Login");
      navigation.navigate("Login");
    });
  };

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.username}>{username}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignOut} style={[styles.button, styles.signOutButton]}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
          <View style={styles.spacing} />
          <TouchableOpacity
            onPress={() => handleDeleteAccount(auth.currentUser?.uid)}
            style={[styles.button, styles.deleteButton]}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
    marginTop: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    marginBottom: 30,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  signOutButton: {
    backgroundColor: "#4A4A4A",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  spacing: {
    height: 20,
  },
});

export default UserProfileScreen;
