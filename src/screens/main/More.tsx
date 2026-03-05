import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { DataContext } from '../../store/GlobalState';
import Icon from 'react-native-vector-icons/Ionicons';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';

export default function More({ navigation }: any) {
  const { state, logout } = useContext(DataContext)!;
  const { auth, language } = state;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image
            style={styles.avatarImg}
            source={auth.user?.image ? { uri: auth.user.image } : sample_profile_avatar}
          />
        </View>
        <Text style={styles.userName}>{auth.user?.name || 'User'}</Text>
        
        <View style={styles.contactInfo}>
          <View style={styles.infoRow}>
            <Icon name="call-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{auth.user?.phone || 'N/A'}</Text>
          </View>
          <View style={[styles.infoRow, { marginLeft: 15 }]}>
            <Icon name="mail-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{auth.user?.email || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* MENU SECTION */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Icon name="person-outline" size={22} color="green" />
          </View>
          <Text style={styles.menuText}>
            {language === 'EN' ? 'Edit Profile' : 'এডিট প্রোফাইল'}
          </Text>
          <Icon name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        {/* You can add more rows here like "Language", "Security" etc */}

        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomWidth: 0 }]} 
          activeOpacity={0.7}
          onPress={logout}
        >
          <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
            <Icon name="exit-outline" size={22} color="#D32F2F" />
          </View>
          <Text style={[styles.menuText, { color: '#D32F2F' }]}>
            {language === 'EN' ? 'Logout' : 'লগ আউট'}
          </Text>
          <Icon name="chevron-forward" size={20} color="#FFCDD2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Version 1.0.2</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileCard: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#E8F5E9',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginTop: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingVertical: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#AAA',
    textTransform: 'uppercase',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginLeft: 15,
  },
  versionText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 12,
    marginTop: 30,
    marginBottom: 20,
  },
});