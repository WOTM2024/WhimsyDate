// NavigationModal.js
import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const NavigationModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const translateY = useSharedValue(visible ? 0 : 1000);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = withSpring(50);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleNavigation = (screenName) => {
    onClose();
    navigation.navigate(screenName);
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalViewOverlay}>
        <Animated.View style={[styles.modalAnimatedContainer, animatedStyle]}>
          <View className="mt-10">
            <TouchableOpacity onPress={() => handleNavigation("Welcome")}>
              <Text style={styles.modalItem}>Welcome</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigation("Home")}>
              <Text style={styles.modalItem}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigation("Activities")}>
              <Text style={styles.modalItem}>Activities</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigation("Inspiration")}>
              <Text style={styles.modalItem}>Inspiration</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigation("User Profile")}>
              <Text style={styles.modalItem}>User Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalItem}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalViewOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalAnimatedContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default NavigationModal;
