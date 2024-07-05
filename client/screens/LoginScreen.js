// LoginScreen.js
// rnfes
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import trimmedLogo from "../assets/trimmed_logo.png";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onPressHandle_navWelcome() {
    navigation.navigate("Welcome");
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        navigation.navigate("Welcome");
      } else {
        // signed out
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed up as: " + user.email);
      navigation.navigate("Welcome");
    });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log("Logged in as: " + user.email);
      navigation.navigate("Welcome");
    });
  };

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1 }}>
      <View className="flex-1 items-center">
        {/* <Text className="text-5xl">Login</Text> */}
        <View className="m-6" />
        <Image source={trimmedLogo} className="w-52 h-52 rounded-full" />
        <View className="m-3" />
        <KeyboardAvoidingView className="w-80">
          <TextInput
            placeholder="email"
            keyboardType="default"
            className="border border-light_border  p-2 rounded-md"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View className="m-2" />
          <TextInput
            placeholder="username"
            keyboardType="default"
            className="border border-light_border  p-2 rounded-md"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <View className="m-2" />
          <TextInput
            placeholder="password"
            keyboardType="default"
            className="border border-light_border  p-2 rounded-md"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <View className="m-1" />
          {/* <View className="flex-row justify-end">
            <Text className="">Forgot Password</Text>
          </View> */}
        </KeyboardAvoidingView>
        <View className="m-3" />
        <View className="w-80">
          <TouchableOpacity className="border bg-light_button_background p-2 rounded-lg" onPress={handleLogin}>
            <Text className="text-base text-center text-light_button_text">Login</Text>
          </TouchableOpacity>
          <View className="m-1" />
          <TouchableOpacity className="border p-2 rounded-lg" onPress={handleSignUp}>
            <Text className="text-base text-center text-light_text">Register</Text>
          </TouchableOpacity>
        </View>
        {/* Below is temp content */}
        <View className="m-10" />
        <TouchableOpacity onPress={onPressHandle_navWelcome} className="border">
          <Text className="text-base">welcome screen</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
