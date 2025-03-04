import * as React from "react";
import { View, Text, Pressable, StyleSheet, Image, Dimensions } from "react-native";
import { RadioButton } from "react-native-paper";
import { useRouter } from 'expo-router';

const { width } = Dimensions.get("window");

function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("English");
  const router = useRouter();

  const handleContinue = () => {
    router.push('/sign_in'); // Navigate back to sign-in page
  };

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.header}>Change language</Text>
        <Text style={styles.subHeader}>Which language do you prefer?</Text>
        
        <Pressable style={styles.languageOption} onPress={() => setSelectedLanguage("English")}>
          <Text style={styles.languageText}>English</Text>
          <RadioButton 
            value="English"
            status={selectedLanguage === "English" ? "checked" : "unchecked"}
          />
        </Pressable>

        <Pressable style={styles.languageOption} onPress={() => setSelectedLanguage("Bahasa Indonesia")}>
          <Text style={styles.languageText}>Bahasa Indonesia</Text>
          <RadioButton 
            value="Bahasa Indonesia"
            status={selectedLanguage === "Bahasa Indonesia" ? "checked" : "unchecked"}
          />
        </Pressable>

        <Pressable style={styles.languageOption} onPress={() => setSelectedLanguage("Tiếng Việt")}>
          <Text style={styles.languageText}>Tiếng Việt</Text>
          <RadioButton 
            value="Tiếng Việt"
            status={selectedLanguage === "Tiếng Việt" ? "checked" : "unchecked"}
          />
        </Pressable>
        
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue in {selectedLanguage}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  languageText: {
    fontSize: 16,
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
});

export default LanguageSelectionScreen;