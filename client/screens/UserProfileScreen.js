import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  StyleSheet,
  TextInput,
} from "react-native";
import UserAvatar from "react-native-user-avatar";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import {
  deleteUserByUID,
  fetchUserByUID,
  patchUserNameWithNewName,
} from "../api";
import { deleteUser } from "firebase/auth";

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleDeleteAccount = () => {
    const currentUser = auth.currentUser;
    const currentUserId = auth.currentUser?.uid;
    Promise.all([deleteUser(currentUser), deleteUserByUID(currentUserId)]).then(
      (response) => {
        console.log(response);
        navigation.navigate("Login");
      }
    );
  };
  const handleChangeUsername = () => {
    patchUserNameWithNewName(auth.currentUser?.uid, newUsername)
      .then(({ data }) => {
        setUsername(data.data.username);
        setIsEditingUsername(false);
        setNewUsername("");
      })
      .catch((error) => {
        if (error.response.status === 409) {
          setError("Username is already taken. Please choose another one.");
        } else {
          setError("An error occurred. Please try again.");
        }
      });
  };

  useEffect(() => {
    // console.log(auth.currentUser?.uid);
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
    <LinearGradient
      colors={["#D9D9D9", "#B999FF", "#D9D9D9"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.profileContainer}>
          <UserAvatar size={50} src="https://source.boringavatars.com/beam" />
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{username}</Text>
            {isEditingUsername ? (
              <View style={styles.editUsernameContainer}>
                <TextInput
                  style={styles.input}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter new username"
                />
                <TouchableOpacity
                  onPress={handleChangeUsername}
                  style={[styles.buttonUsername, styles.submitUsernameButton]}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditingUsername(true)}
                style={[styles.buttonUsername, styles.editUsernameButton]}
              >
                <Text style={styles.buttonText}>Edit Username</Text>
              </TouchableOpacity>
            )}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={[styles.button, styles.signOutButton]}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
          <View style={styles.spacing} />
          <TouchableOpacity
            onPress={handleDeleteAccount}
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
    justifyContent: "space-between",
  },
  profileContainer: {
    backgroundColor: "blue",
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
    flex: 0.4,
  },
  usernameContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginLeft: 20,
  },
  username: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginLeft: 20,
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
  editUsernameButton: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitUsernameButton: {
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  spacing: {
    height: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    width: 200,
    backgroundColor: "#FFFFFF",
  },
  editUsernameContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
export default UserProfileScreen;
