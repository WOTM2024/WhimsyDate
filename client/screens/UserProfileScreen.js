import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";
import { deleteUserByUID, fetchUserByUID, patchUserNameWithNewName } from "../api";
import { deleteUser } from "firebase/auth";
import Svg, { SvgXml } from "react-native-svg";
import Modal from "react-native-modal";

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [avatarSvgContent, setAvatarSvgContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeleteAccount = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    const currentUser = auth.currentUser;
    const currentUserId = auth.currentUser?.uid;
    Promise.all([deleteUser(currentUser), deleteUserByUID(currentUserId)]).then((response) => {
      console.log(response);
      navigation.navigate("Login");
    });
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const handleChangeUsername = () => {
    patchUserNameWithNewName(auth.currentUser?.uid, newUsername)
      .then(({ data }) => {
        setUsername(data.data.username);
        setIsEditingUsername(false);
        setNewUsername("");
        setError("");
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

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch("https://source.boringavatars.com/beam");
        if (response.ok) {
          const svg = await response.text();
          setAvatarSvgContent(svg);
          // console.log(avatarSvgContent);
        } else {
          console.error("Failed to fetch SVG");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSvg();
  }, []);

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF", "#D9D9D9"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <View className="m-12" />
        <View className="bg-white p-5 ml-10 flex-row rounded-l-2xl border">
          <View className="rounded-full mr-10">
            {avatarSvgContent ? (
              <SvgXml xml={avatarSvgContent} width="100" height="100" />
            ) : (
              <Text>Loading avatar...</Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-semibold">{username}</Text>
            {isEditingUsername ? (
              <View className="">
                <TextInput
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter new username"
                  className="border flex-row items-center border-light_border p-2 rounded-md focus:border-purple-600"
                />
                <TouchableOpacity onPress={handleChangeUsername} className="border bg-slate-950 p-2 rounded-lg mt-2">
                  <Text className="text-base text-center text-light_button_text font-semibold">Submit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsEditingUsername(true)}
                className="border bg-slate-950 p-2 rounded-lg mt-2"
              >
                <Text className="text-base text-center text-light_button_text font-semibold">Edit Username</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="items-center">{error ? <Text className="text-center">{error}</Text> : null}</View>
        <View className="m-2"></View>

        {/* Temp view block. Push buttons to the bottom */}
        <View className="flex-1" />

        <View className="mb-10">
          <TouchableOpacity
            onPress={handleSignOut}
            className="ml-10 mr-10 p-4 border border-light_border rounded-md bg-light_button_background/25"
          >
            <Text className="text-center font-semibold text-light_text">Log out</Text>
          </TouchableOpacity>
          <View className="m-2"></View>
          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="ml-10 mr-10 p-4 border border-light_border rounded-md bg-red-500/75"
          >
            <Text className="text-center font-semibold text-red-950">Delete Account</Text>
          </TouchableOpacity>
          <DeleteAccountConfirmationModal
            isVisible={isModalVisible}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const DeleteAccountConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <View>
      <Modal isVisible={isVisible}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            maxHeight: "25%",
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "black" }}>Confirm Account Deletetion?</Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Button title="Cancel" onPress={onCancel} color="#4C25A2" />
            <View style={{ margin: 10 }}></View>
            <Button title="Delete" onPress={onConfirm} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserProfileScreen;
