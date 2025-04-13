import * as React from "react";
import { Dimensions, Text, View, Image, StyleSheet, Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useRouter } from 'expo-router';

const data = [
  { id: 1, image: require('@/assets/images/Slide1-removebg-preview.png'), text: "Get going with us" },
  { id: 2, image: require('@/assets/images/Slide2-removebg-preview.png'), text: "Welcome to Gojek!" },
  { id: 3, image: require('@/assets/images/Slide3-removebg-preview.png'), text: "Rides for all" },
];

const { width, height } = Dimensions.get("window");

function App() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const router = useRouter();

  React.useEffect(() => {
    const interval = setInterval(() => {
      ref.current?.scrollTo({ count: 1, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({ count: index - progress.value, animated: true });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.languageButton} onPress={() => router.push('/language')}>
        <Text style={styles.languageText}>🇬🇧 English</Text>
      </Pressable>

      <Carousel
        ref={ref}
        width={width * 0.9}
        height={height * 0.35}
        data={data}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "#2EAD33", borderRadius: 50, width: 10, height: 10 }}
        containerStyle={{ marginTop: 10 }}
        onPress={onPressPagination}
      />

      <View style={styles.buttonContainer}>
        <Pressable style={styles.loginButton} onPress={() => router.push('/task')}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.signUpButton}>
          <Text style={styles.signUpText}>I'm new, sign me up</Text>
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
    paddingVertical: 20,
  },
  languageButton: {
    position: "absolute",
    top: 50, // Added some space from the top
    right: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: height * 0.3,
    resizeMode: "contain",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#2EAD33",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  signUpButton: {
    borderColor: "#2EAD33",
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    color: "#2EAD33",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;


