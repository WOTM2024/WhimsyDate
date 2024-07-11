import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { postUserEntryToCategory, addActivity } from "../api";
import { auth } from "../firebase";

const AddActivityForm = ({ onClose, onAddActivity }) => {
  const [activityName, setActivityName] = useState("");
  const [category, setCategory] = useState("");
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [cost, setCost] = useState(false);

  const handleSubmit = async () => {
    if (!activityName || !category) {
      Alert.alert(`Error, please fill in all fields`);
      return;
    }

    const newActivity = await addActivity(activityName, category, isCollaborative, cost);
    console.log("new activity>>>>>>>>>", newActivity);
    const newActivityId = newActivity.data._id;
    console.log("new Id >>>>>>>>>>>>", newActivityId);

    const newEntry = {
      activity_name: activityName,
      category,
      isCollaborative,
      cost,
    };

    const user = auth.currentUser;
    if (user) {
      const tempId = new Date().toISOString();
      const optimisticEntry = { ...newEntry, _id: tempId };
      onAddActivity(optimisticEntry);

      try {
        const addedEntry = await postUserEntryToCategory(user.uid, "user_activities", newActivityId);
        onAddActivity((prevActivities) =>
          prevActivities.map((activity) => (activity._id === tempId ? addedEntry : activity))
        );
        onClose();
      } catch (error) {
        console.error("Error adding activity", error);
        Alert.alert(`Error, something went wrond while adding activity`);
        onAddActivity((prevActivities) => prevActivities.filter((activity) => activity._id !== tempId));
      }
    }
  };
  return (
    <View style={{ padding: 20, backgroundColor: "white", borderRadius: 10, width: "80%" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" }}>
        Add a New Activity
      </Text>
      <TextInput
        placeholder="Activity Name"
        value={activityName}
        onChangeText={setActivityName}
        style={{ borderWidth: 2, borderColor: "gray", marginVertical: 20, padding: 8, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderWidth: 2, borderColor: "gray", marginBottom: 10, padding: 8, borderRadius: 5 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingLeft: 5,
        }}
      >
        <Text>Collaborative:</Text>
        <Switch value={isCollaborative} onValueChange={setIsCollaborative} />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingLeft: 5,
        }}
      >
        <Text>Cost:</Text>
        <Switch value={cost} onValueChange={setCost} />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#B999FF",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          marginVertical: 10,
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Add Activity</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onClose}
        style={{
          backgroundColor: "red",
          padding: 10,
          marginVertical: 20,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddActivityForm;
