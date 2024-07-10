import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import Modal from "react-native-modal";
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
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <Animated.View style={[styles.modalAnimatedContainer, animatedStyle]}>
        <View style={styles.modalContent}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default NavigationModal;
