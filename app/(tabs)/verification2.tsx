import * as React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

function OTPInputScreen() {
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const [timer, setTimer] = React.useState(60);
  const { method } = useLocalSearchParams<{ method: string }>();
  const router = useRouter();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const navigateToVerification = () => {
    router.push("/verification");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter OTP sent via {method}</Text>
      <Text style={styles.subHeader}>Check your {method?.toLowerCase()} for the code</Text>
      
      <Text style={styles.label}>OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOTPChange(value, index)}
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        <Ionicons name="reload-circle" size={24} color={timer > 0 ? "#2EAD33" : "#ccc"} />
        <Text style={styles.timerText}>00:{timer < 10 ? `0${timer}` : timer}</Text>
      </View>

      <Pressable style={styles.methodButton} onPress={navigateToVerification}>
        <Text style={styles.methodButtonText}>Try another method</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpInput: {
    width: width * 0.15,
    height: width * 0.15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  timerText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#2EAD33",
  },
  methodButton: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },
  methodButtonText: {
    fontSize: 14,
    color: "#333",
  },
});

export default OTPInputScreen;
