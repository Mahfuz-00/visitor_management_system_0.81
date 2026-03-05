import React, { useState, useRef, useContext } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from '../store/GlobalState';
import { ACTIONS } from '../store/Actions';
import packageJson from '../../package.json';

const { width, height } = Dimensions.get('window');

const COLORS = { 
  primary: '#1B5E20',
  white: '#fff',
  lightText: '#7F8C8D',
  toggleBg: '#E8F5E9'
};

export default function OnboardingScreen({ navigation }: any) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  
  // ✅ Access Global State
  const { state, dispatch } = useContext(DataContext)!;
  const { language } = state;
  const isBN = language === 'BN';

  // ✅ Dynamic Slides Content
  const slides = [
    {
      id: '1',
      image: require('../assets/logo.png'),
      title: isBN ? 'বিটিআরসি ই-পাস' : 'BTRC e-Pass',
      subtitle: isBN 
        ? 'অফিসিয়াল ডিজিটাল অ্যাপয়েন্টমেন্ট এবং ভিজিটর ম্যানেজমেন্ট সিস্টেম।' 
        : 'Official digital appointment and visitor management system.',
    },
  ];

  const toggleLanguage = async () => {
    const newLang = isBN ? 'EN' : 'BN';
    dispatch({ type: ACTIONS.LANGUAGE, payload: newLang });
    await AsyncStorage.setItem('language', newLang);
  };

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const Slide = ({ item }: any) => (
    <View style={styles.slideContainer}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const Footer = () => (
    <View style={styles.footer}>
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlideIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.btn} 
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.btnText}>
            {isBN ? 'শুরু করুন' : 'CONTINUE'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>
            {isBN ? 'ভার্সন' : 'Version'} {packageJson.version}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* ✅ Language Toggle */}
      <View style={styles.topActionRow}>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{isBN ? 'English' : 'বাংলা'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height * 0.60 }}
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
  container: { flex: 1, backgroundColor: COLORS.white },
  topActionRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  languageToggle: {
    backgroundColor: COLORS.toggleBg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  languageText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  slideContainer: { width, alignItems: 'center', justifyContent: 'center', padding: 24 },
  imageContainer: { flex: 0.6, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  image: { height: '100%', width: width * 0.7, resizeMode: 'contain' },
  textContainer: { flex: 0.4, alignItems: 'center', justifyContent: 'center' },
  title: { color: COLORS.primary, fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: COLORS.lightText, fontSize: 16, marginTop: 12, textAlign: 'center', paddingHorizontal: 40 },
  footer: { height: height * 0.30, justifyContent: 'space-between', paddingHorizontal: 40 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  indicator: { height: 5, width: 5, backgroundColor: '#E0E0E0', marginHorizontal: 4, borderRadius: 5 },
  activeIndicator: { backgroundColor: COLORS.primary, width: 20 },
  buttonContainer: { marginBottom: 30, alignItems: 'center' },
  btn: { 
    height: 56, 
    width: '100%', 
    borderRadius: 16, 
    backgroundColor: COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnText: { fontWeight: 'bold', fontSize: 16, color: COLORS.white, letterSpacing: 1.2 },
  versionText: { marginTop: 15, fontSize: 11, color: '#BDC3C7' }
});