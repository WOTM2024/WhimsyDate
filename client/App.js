// App.js
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import RouletteScreen from "./screens/RouletteScreen";
import TieBreakerScreen from "./screens/TieBreakerScreen";
import GameRoomScreen from "./screens/GameRoomScreen";
import LoginScreen from "./screens/LoginScreen";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import InspirationScreen from "./screens/InspirationScreen";
import TestScreen from "./screens/TestScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, UserIcon, Bars3Icon, RocketLaunchIcon } from "react-native-heroicons/solid";
import UserProfileScreen from "./screens/UserProfileScreen";
import FlappyBirdScreen from "./screens/FlappyBirdScreen";
import NavigationModal from "./components/NavigationModal/NavigationModal";
import { UserProvider } from "./contexts/UserContext";

import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTransparent: true,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Roulette" component={RouletteScreen} />
            <Stack.Screen name="Activities" component={ActivitiesScreen} />
            <Stack.Screen name="Inspiration" component={InspirationScreen} />
            {/* <Stack.Screen name="Game Room" component={GameRoomScreen} /> */}
            {/* <Stack.Screen name="FlappyBird" component={FlappyBirdScreen} /> */}
          </Stack.Navigator>
          <NavigationModal visible={isModalVisible} onClose={toggleModal} />
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

function TabBarIcon({ route, focused, color, size }) {
  let IconComponent;
  if (route.name === "Home") {
    IconComponent = RocketLaunchIcon;
  } else if (route.name === "Menu") {
    IconComponent = Bars3Icon;
  } else if (route.name === "User Profile") {
    IconComponent = UserIcon;
  }

  const scale = useSharedValue(focused ? 1.1 : 1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent size={size} color={color} />
    </Animated.View>
  );
}

function TabsNavigator({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: (props) => <TabBarIcon {...props} route={route} />,
          tabBarActiveTintColor: "#4C25A2",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
          tabBarIconStyle: {
            marginTop: -2,
          },
          tabBarItemStyle: {
            borderRadius: 10,
            margin: 5,
          },
          headerTransparent: true,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home", headerShown: false }} />
        <Tab.Screen
          name="Menu"
          component={EmptyComponent}
          options={{ tabBarLabel: "Menu", headerShown: false }}
          listeners={{
            tabPress: (event) => {
              event.preventDefault();
              toggleModal();
            },
          }}
        />
        <Tab.Screen
          name="User Profile"
          component={UserProfileScreen}
          options={{ tabBarLabel: "User", headerShown: false }}
        />
      </Tab.Navigator>
      <NavigationModal visible={isModalVisible} onClose={toggleModal} />
    </>
  );
}

function EmptyComponent() {
  return null;
}
