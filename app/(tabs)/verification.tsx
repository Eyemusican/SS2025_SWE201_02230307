import * as React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

function OTPVerificationScreen() {
  const router = useRouter();

  const handleNavigation = (method: string) => {
    router.push({
      pathname: "/verification2",
      params: { method },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.push('/task')}>
        <Image 
          source={require("@/assets/images/download (1).png")} 
          style={styles.backIcon}  
        />
      </Pressable>

      <Text style={styles.header}>Choose verification method</Text>
      
      <Pressable style={styles.optionButton} onPress={() => handleNavigation("E-Mail")}>
        <Image
          source={require("@/assets/images/gmail-removebg-preview.png")} 
          style={styles.icon}
        />

        <Text style={styles.optionText}>OTP via E-mail</Text>
        <Text style={styles.arrow}>&gt;</Text>
      </Pressable>
      
      <Pressable style={styles.optionButton} onPress={() => handleNavigation("WhatsApp")}>
        <Image 
          source={require("@/assets/images/whatsapp-removebg-preview.png")} 
          style={styles.icon}
        />
        <Text style={styles.optionText}>OTP via WhatsApp</Text>
        <Text style={styles.arrow}>&gt;</Text>
      </Pressable>
      
      <Pressable style={styles.optionButton} onPress={() => handleNavigation("SMS")}>
        <Image  
          source={require("@/assets/images/SMS-removebg-preview.png")} 
          style={styles.icon}
        />
        <Text style={styles.optionText}>OTP via SMS</Text>
        <Text style={styles.arrow}>&gt;</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Increased padding to move content downward
  },
  backButton: {
    position: "absolute",
    top: 40, // Lowered the back button
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: "#999",
  },
});

export default OTPVerificationScreen;
