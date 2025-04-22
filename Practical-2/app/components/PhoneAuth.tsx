import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Function to request OTP
  async function requestOTP() {
    if (!phone || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      // Format phone number to include '+' if not already included
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const {data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      console.log('OTP request response:', data);



      if (error) throw error;
      
      // Start countdown timer (60 seconds)
      setRemainingTime(60);
      const countdownTimer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      setTimer(countdownTimer);
      setOtpSent(true);
      Alert.alert('Success', 'OTP has been sent to your phone number');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // Function to verify OTP
  async function verifyOTP() {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;
      
      // OTP verification successful
      console.log('Successfully logged in:', data);
      
      // Clean up timer if it exists
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  // Function to resend OTP
  function resendOTP() {
    if (remainingTime > 0) return;
    requestOTP();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Phone Authentication</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Phone Number (e.g. +1234567890)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          editable={!otpSent || remainingTime === 0}
        />
        
        {otpSent ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
            <Button
              title="Verify OTP"
              onPress={verifyOTP}
              disabled={loading || otp.length !== 6}
            />
            
            <View style={styles.resendContainer}>
              {remainingTime > 0 ? (
                <Text style={styles.timerText}>Resend in {remainingTime}s</Text>
              ) : (
                <Button
                  title="Resend OTP"
                  onPress={resendOTP}
                  disabled={loading}
                />
              )}
            </View>
          </>
        ) : (
          <Button
            title={loading ? "Sending..." : "Request OTP"}
            onPress={requestOTP}
            disabled={loading || !phone}
          />
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
  },
  resendContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  timerText: {
    color: '#888',
    marginTop: 8,
  }
});