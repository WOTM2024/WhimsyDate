import React, { useState } from "react";
import { Button, Text, View, TextInput } from "react-native";
import Modal from "react-native-modal";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordModal({ isVisible, toggleModal }) {
  const [emailString, setEmailString] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [alertMessageColor, setAlertMessageColor] = useState("black");
  function handleForgotPassword() {
    sendPasswordResetEmail(auth, emailString)
      .then((response) => {
        console.log(response);
        setAlertMessageColor("green");
        setIsShowAlert(true);
        setAlertMessage("Please check your email and follow the instructions to reset your password");
        setEmailString("");
      })
      .catch((error) => {
        console.error(error);
        setAlertMessageColor("red");
        setIsShowAlert(true);
        setAlertMessage(error.code);
      });
  }
  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F0F0F0",
          borderRadius: 20,
          maxHeight: 300,
        }}
      >
        <Text>Forgot Password</Text>
        <TextInput
          placeholder="enter your email"
          keyboardType="default"
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            padding: 10,
            marginVertical: 10,
            borderRadius: 5,
            fontSize: 16,
            backgroundColor: "#ffffff",
            width: "50%",
          }}
          value={emailString}
          onChangeText={(text) => setEmailString(text)}
        />
        <Button title="Reset Password" onPress={() => handleForgotPassword()} color="#4C25A2" />
        {isShowAlert ? (
          <View>
            <Text style={{ color: alertMessageColor, textAlign: "center", margin: 5 }}>{alertMessage}</Text>
          </View>
        ) : null}
        <View style={{ margin: 10 }}></View>
        <Button
          title="Hide"
          onPress={() => {
            setIsShowAlert(false);
            setAlertMessageColor("black");
            setAlertMessage("");
            toggleModal();
          }}
          color="#4C25A2"
        />
      </View>
    </Modal>
  );
}
