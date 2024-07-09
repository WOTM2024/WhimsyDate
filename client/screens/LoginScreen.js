// LoginScreen.js
// rnfes
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import trimmedLogo from "../assets/trimmed_logo.png";
import { auth } from "../firebase";
import { UserContext } from "../contexts/UserContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { addUserToDB } from "../api";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUsername } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsernameState] = useState("");
  const [password, setPassword] = useState("");
  const [tempErrorMessage, setTempErrorMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function onPressHandle_navWelcome() {
    navigation.navigate("Tabs");
  }

  useEffect(() => {
    if (isConfirmation) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          // console.log(uid);
          setIsConfirmation(false);
          navigation.navigate("Tabs");
        }
      });
      return unsubscribe;
    }
  }, [isConfirmation]);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log("Signed up as:", user.email);
        setUsername(username); // Set context username
        console.log("Username set to:", username); // Log username here
        return addUserToDB(username, user.uid);
      })
      .then(({ data }) => {
        console.log(data.success);
        if (data.success) {
          setIsConfirmation(true);
        }
      })
      .catch((error) => {
        setTempErrorMessage(`${error.code}`);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in as:", user.email);
        setUsername(username); // Set context username
        navigation.navigate("Tabs");
      })
      .catch((error) => {
        setTempErrorMessage(`${error.code}`);
      });
  };

  const checkLoginValidation = (state) => {
    if (!email || (!username && !isLogin) || !password) {
      setTempErrorMessage("* Please fill in all fields");
      return;
    } else {
      setTempErrorMessage("");
    }

    if (state === "login") {
      handleLogin();
    } else if (state === "register") {
      handleSignUp();
    }
  };

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center">
        <View className="m-8" />
        {/* <Text className="text-5xl">Login</Text> */}
        <View className="m-6" />
        <Image source={trimmedLogo} className="w-52 h-52 rounded-full" />
        <View className="m-3" />
        <KeyboardAvoidingView className="w-80">
          {tempErrorMessage ? <Text className="bg-red-600/50 rounded p-2 my-1">{tempErrorMessage}</Text> : null}
          <TextInput
            placeholder="email"
            keyboardType="default"
            className="border border-light_border p-2 rounded-md focus:border-purple-600"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View className="m-2" />
          {!isLogin ? (
            <TextInput
              placeholder="username"
              keyboardType="default"
              className="border border-light_border p-2 rounded-md focus:border-purple-600"
              value={username}
              onChangeText={(text) => setUsernameState(text)}
            />
          ) : null}
          {!isLogin ? <View className="m-2" /> : null}
          <TextInput
            placeholder="password"
            keyboardType="default"
            className="border border-light_border p-2 rounded-md focus:border-purple-600"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <View className="m-1" />
        </KeyboardAvoidingView>
        <View className="m-3" />
        <View className="w-80">
          {isLogin ? (
            <Pressable
              className="border bg-light_button_background p-2 rounded-lg active:bg-violet-700"
              onPress={() => checkLoginValidation("login")}
            >
              <Text className="text-base text-center text-light_button_text">Login</Text>
            </Pressable>
          ) : null}
          {isLogin ? <View className="m-1" /> : null}

          {!isLogin ? (
            <Pressable
              className="border bg-light_button_background p-2 rounded-lg active:bg-violet-700"
              onPress={() => checkLoginValidation("register")}
            >
              <Text className="text-base text-center text-light_button_text">Register</Text>
              {!isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#1E1E1E"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              ) : null}
            </Pressable>
          ) : null}
        </View>
        <View className="m-2">
          {!isLogin ? (
            <Text>
              Already have an account?{" "}
              <TouchableOpacity>
                <Text
                  className="text-center justify-center text-light_text"
                  onPress={() => {
                    setIsLogin(true);
                    setTempErrorMessage("");
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>{" "}
            </Text>
          ) : (
            <Text>
              Don't have an account?{" "}
              <TouchableOpacity>
                <Text
                  className="text-center justify-center text-light_text"
                  onPress={() => {
                    setIsLogin(false);
                    setTempErrorMessage("");
                  }}
                >
                  Register
                </Text>
              </TouchableOpacity>{" "}
            </Text>
          )}
        </View>

        {/* Below is temp content */}
        <View className="m-10" />
        <TouchableOpacity onPress={onPressHandle_navWelcome} className="border">
          <Text className="text-base">skip login for dev</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
