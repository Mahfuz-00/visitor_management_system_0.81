import React, { useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { DataContext } from '../../store/GlobalState';
import Icon from 'react-native-vector-icons/Ionicons';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';

export default function More({ navigation }: any) {
  const { state, logout } = useContext(DataContext)!;
  const { auth, language } = state;

  useEffect(() => {
    console.log('more:', JSON.stringify(auth.user));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 15 }}>
      <View style={{ backgroundColor: '#FFF', flex: 1, borderRadius: 8 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              style={styles.avatarImg}
              source={auth.user?.image ? { uri: auth.user.image } : sample_profile_avatar}
            />
          </View>
          <Text style={styles.userName}>{auth.user?.name || 'User'}</Text>
          <Text style={styles.phone}>{auth.user?.phone || 'N/A'}</Text>
          <Text style={styles.email}>{auth.user?.email || 'N/A'}</Text>
        </View>

        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('EditProfile')}>
          <Icon name="md-person-outline" size={30} color="green" />
          <Text style={styles.menuText}>
            {language === 'en' ? 'Edit Profile' : 'এডিট প্রোফাইল'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={logout}>
          <Icon name="exit-outline" size={30} color="green" />
          <Text style={[styles.menuText, { color: 'red' }]}>
            {language === 'en' ? 'Logout' : 'লগ আউট'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { borderBottomWidth: 0.5, borderBottomColor: 'grey', alignItems: 'center', paddingVertical: 40 },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'green',
    elevation: 5,
  },
  avatarImg: { width: '100%', height: '100%' },
  userName: { fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  phone: { fontSize: 14, fontWeight: 'bold' },
  email: { fontSize: 14, fontWeight: 'bold' },
  menuRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
  },
  menuText: { fontSize: 20, color: '#000', fontWeight: 'bold', marginLeft: 20 },
});