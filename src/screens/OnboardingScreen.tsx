import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = { primary: '#282534', white: '#fff' };

const slides = [
  {
    id: '1',
    image: require('../assets/logo.png'),
    title: 'BTRC',
    subtitle: 'Welcome to e-pass',
  },
];

const Slide = ({ item }: { item: typeof slides[0] }) => (
  <View style={{ alignItems: 'center' }}>
    <Image source={item.image} style={{ height: '50%', width, resizeMode: 'contain' }} />
    <View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  </View>
);

export default function OnboardingScreen({ navigation }: any) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const Footer = () => (
    <View style={{ height: height * 0.25, justifyContent: 'space-between', paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlideIndex === index && { backgroundColor: 'green', width: 25 },
            ]}
          />
        ))}
      </View>

      <View style={{ marginBottom: 20 }}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Login')}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#FFF' }}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height * 0.75 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  title: {
    color: 'green',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: 'red',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    height: 50,
    borderRadius: 5,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
});