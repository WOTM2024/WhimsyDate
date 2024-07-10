import React, { useEffect, useState } from "react";
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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { addUserToDB } from "../api";
import { EnvelopeIcon, UserIcon, LockClosedIcon } from "react-native-heroicons/solid";
import ForgotPasswordModal from "../components/ForgotPasswordModal/ForgotPasswordModal";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tempErrorMessage, setTempErrorMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForward, setIsForward] = useState(true);
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isForward) {
        navigation.navigate("Tabs");
      }
    });

    return () => unsubscribe();
  }, [isForward]);

  const handleSignUp = () => {
    setIsLoading(true);
    setIsForward(false);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return addUserToDB(username, user.uid);
      })
      .then(({ data }) => {
        if (data.success) {
          setIsLoading(false);
          setEmail("");
          setUsername("");
          setPassword("");
          setIsForward(true);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setTempErrorMessage(`${error.code}`);
      });
  };

  const handleLogin = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoading(false);
        setEmail("");
        setUsername("");
        setPassword("");
        navigation.navigate("Tabs");
      })
      .catch((error) => {
        setIsLoading(false);
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

  const toggleForgotPasswordModal = () => {
    setForgotPasswordModalVisible(!isForgotPasswordModalVisible);
  };

  return (
    <LinearGradient colors={["#D9D9D9", "#B999FF"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 items-center">
        <View className="m-8" />
        <Image source={trimmedLogo} className="w-52 h-52 rounded-full" />
        <View className="m-3" />
        <KeyboardAvoidingView className="w-80">
          {tempErrorMessage ? <Text className="bg-red-600/50 rounded p-2 my-1">{tempErrorMessage}</Text> : null}
          <View className="border flex-row items-center border-light_border p-2 rounded-md focus:border-purple-600">
            <EnvelopeIcon size={22} color="#1E1E1E" />
            <TextInput
              placeholder="email"
              keyboardType="default"
              className="m-1 w-full"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View className="m-2" />
          {!isLogin ? (
            <View className="border flex-row items-center border-light_border p-2 rounded-md focus:border-purple-600">
              <UserIcon size={22} color="#1E1E1E" />
              <TextInput
                placeholder="username"
                keyboardType="default"
                className="m-1 w-full"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
          ) : null}
          {!isLogin ? <View className="m-2" /> : null}

          <View className="border flex-row items-center border-light_border p-2 rounded-md focus:border-purple-600">
            <LockClosedIcon size={22} color="#1E1E1E" />
            <TextInput
              placeholder="password"
              keyboardType="default"
              className="m-1 w-full"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </View>
          {isLogin ? (
            <View>
              <View className="m-1" />
              <TouchableOpacity className="flex-row justify-end" onPress={toggleForgotPasswordModal}>
                <Text>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View className="m-1" />
          <ForgotPasswordModal isVisible={isForgotPasswordModalVisible} toggleModal={toggleForgotPasswordModal} />
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
              disabled={isLoading}
              onPress={() => checkLoginValidation("register")}
            >
              <Text className="text-base text-center text-light_button_text">Register</Text>
              {isLoading ? (
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

        <View className="m-10" />
        <TouchableOpacity onPress={() => navigation.navigate("Tabs")} className="border">
          <Text className="text-base">skip login for dev</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
