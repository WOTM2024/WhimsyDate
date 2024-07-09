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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import trimmedLogo from "../assets/trimmed_logo.png";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { UserContext } from "../contexts/UserContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUsername } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [username, setUsernameState] = useState("");
  const [password, setPassword] = useState("");
  const [tempErrorMessage, setTempErrorMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        console.log("User is signed in:", user.email);
        navigation.navigate("Tabs");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed up as:", user.email);
        setUsername(username); // Set context username
        console.log("Username set to:", username); // Log username here
        navigation.navigate("Welcome");
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
        navigation.navigate("Welcome");
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
      <View className="flex-1 items-center">
        <View className="m-6" />
        <Image source={trimmedLogo} className="w-52 h-52 rounded-full" />
        <View className="m-3" />
        <KeyboardAvoidingView className="w-80">
          {tempErrorMessage ? (
            <Text className="bg-red-600/50 rounded p-2 my-1">
              {tempErrorMessage}
            </Text>
          ) : null}
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
              <Text className="text-base text-center text-light_button_text">
                Login
              </Text>
            </Pressable>
          ) : null}
          {isLogin ? <View className="m-1" /> : null}

          {!isLogin ? (
            <Pressable
              className="border bg-light_button_background p-2 rounded-lg active:bg-violet-700"
              onPress={() => checkLoginValidation("register")}
            >
              <Text className="text-base text-center text-light_button_text">
                Register
              </Text>
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
      </View>
    </LinearGradient>
  );
}
