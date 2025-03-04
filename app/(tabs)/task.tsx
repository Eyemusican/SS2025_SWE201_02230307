import * as React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

function PhoneNumberScreen() {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (phoneNumber.length > 0) {
      router.push("/verification");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Gojek!</Text>
      <Text style={styles.subHeader}>Enter or create an account in a few easy steps.</Text>
      
      <View style={styles.phoneInputContainer}>
        <Pressable style={styles.flagButton}>
          <Image source={{ uri: "https://ntoeyrlnovukknrzwvoz.supabase.co/storage/v1/object/public/Tenzin//download.png" }} style={styles.flagImage} />
          <Text style={styles.flagText}>+975</Text>
        </Pressable>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        {phoneNumber.length > 0 && (
          <Pressable style={styles.clearButton} onPress={() => setPhoneNumber("")}> 
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>

      <Text style={styles.termsText}>
        I agree to Gojek’s <Text style={styles.linkText}>Terms of Service</Text> & <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>

      <Pressable style={styles.issueButton}>
        <Text style={styles.issueButtonText}>Issue with number?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  flagButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginRight: 10,
  },
  flagImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  flagText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#999",
  },
  continueButton: {
    backgroundColor: "#2EAD33",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  linkText: {
    color: "#2EAD33",
    fontWeight: "bold",
  },
  issueButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    alignItems: "flex-start",
    alignSelf: "flex-start",
  },
  issueButtonText: {
    fontSize: 14,
    color: "#333",
  },
});

export default PhoneNumberScreen;
