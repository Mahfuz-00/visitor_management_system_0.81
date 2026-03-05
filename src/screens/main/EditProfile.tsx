import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { DataContext } from '../../store/GlobalState';
import { postData, postImage, getData } from '../../utils/fetchData';
import { Error } from '../../components/Error';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EditProfile({ navigation }: any) {
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state;
  const { user } = auth;

  // Form States
  const [error, setError] = useState('');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [nid, setNid] = useState(user.nid || '');
  const [gender, setGender] = useState(user.gender || 'male');
  const [bloodGroup, setBloodGroup] = useState(user.blood_group || '');
  const [presentAddress, setPresentAddress] = useState(user.address || '');
  const [formImage, setFormImage] = useState<any>(null);

  // Loading & Animation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dots, setDots] = useState('.');

  // Animation logic for dots: . -> .. -> ... -> .. -> .
  useEffect(() => {
    let interval: any;
    if (isSubmitting) {
      let step = 1;
      interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') step = -1;
          if (prev === '.') step = 1;
          
          if (step === 1) return prev + '.';
          return prev.slice(0, -1);
        });
      }, 350);
    } else {
      setDots('.');
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async () => {
    if (!name || !gender || !bloodGroup) {
      return setError('Required fields should not be empty');
    }

    setIsSubmitting(true); // Disable button & start animation
    setError('');

    try {
      const formData = {
        name,
        email,
        phone,
        nid: nid || '',
        gender,
        blood_group: bloodGroup,
        present_address: presentAddress || '',
      };

      const res = await postData('update/profile', formData, auth.token!);
      
      if (res.errors) {
        setError('Failed to update profile');
        setIsSubmitting(false);
        return;
      }

      await uploadImage();

      const res2 = await getData('user', auth.token!);
      const updatedUser = {
        user: res2.data,
        token: auth.token,
        roles: auth.roles,
      };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'AUTH', payload: updatedUser });

      ToastAndroid.show(res.message || 'Profile updated', ToastAndroid.LONG);
      navigation.pop();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  const uploadImage = async () => {
    if (!formImage?.assets?.[0]) return;
    const image = formImage.assets[0];
    const form = new FormData();
    form.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
    await postImage('update/profile/image', form, auth.token!);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', maxWidth: 300, maxHeight: 300 });
    if (!result.didCancel && result.assets?.[0]) {
      setFormImage(result);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              style={styles.avatarImg}
              source={
                formImage?.assets?.[0]?.uri
                  ? { uri: formImage.assets[0].uri }
                  : user.image
                  ? { uri: user.image }
                  : sample_profile_avatar
              }
            />
            <TouchableOpacity style={styles.cameraOverlay} onPress={openGallery} disabled={isSubmitting}>
              <Icon name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>{language === 'BN' ? 'প্রোফাইল আপডেট করুন' : 'Update Profile'}</Text>
        </View>

        <View style={styles.formCard}>
          <Error error={error} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{language === 'BN' ? 'নাম' : 'Name'}</Text>
            <Input style={styles.inputStyle} value={name} onChangeText={setName} editable={!isSubmitting} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{language === 'BN' ? 'ইমেইল' : 'Email'}</Text>
            <Input style={styles.inputStyle} value={email} onChangeText={setEmail} editable={!isSubmitting} keyboardType="email-address" />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>{language === 'BN' ? 'ফোন' : 'Phone'}</Text>
              <Input style={styles.inputStyle} value={phone} onChangeText={setPhone} editable={!isSubmitting} keyboardType="phone-pad" />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>{language === 'BN' ? 'রক্তের গ্রুপ' : 'Blood Group'}</Text>
              <View style={[styles.pickerContainer, isSubmitting && { opacity: 0.5 }]}>
                <Picker selectedValue={bloodGroup} onValueChange={setBloodGroup} enabled={!isSubmitting}>
                  <Picker.Item label="Select" value="" color="#999" />
                  {['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'].map(g => (
                    <Picker.Item key={g} label={g} value={g} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{language === 'BN' ? 'এনআইডি' : 'NID'}</Text>
            <Input style={styles.inputStyle} value={nid} onChangeText={setNid} editable={!isSubmitting} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{language === 'BN' ? 'লিঙ্গ' : 'Gender'}</Text>
            <View style={styles.genderToggle}>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]} 
                onPress={() => !isSubmitting && setGender('male')}
              >
                <Icon name="male" size={18} color={gender === 'male' ? '#FFF' : '#666'} />
                <Text style={[styles.genderBtnText, gender === 'male' && { color: '#FFF' }]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]} 
                onPress={() => !isSubmitting && setGender('female')}
              >
                <Icon name="female" size={18} color={gender === 'female' ? '#FFF' : '#666'} />
                <Text style={[styles.genderBtnText, gender === 'female' && { color: '#FFF' }]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{language === 'BN' ? 'বর্তমান ঠিকানা' : 'Present Address'}</Text>
            <Input 
                value={presentAddress} 
                onChangeText={setPresentAddress} 
                multiline 
                editable={!isSubmitting}
            />
          </View>

          {/* CUSTOM LOADING BUTTON */}
          <TouchableOpacity 
            style={[styles.submitBtn, isSubmitting && styles.disabledBtn]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.btnText}>Loading</Text>
                {/* Fixed width container for dots ensures the text doesn't shift */}
                <View style={styles.dotsContainer}>
                  <Text style={styles.btnText}>{dots}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.btnText}>
                {language === 'BN' ? 'আপডেট করুন' : 'SAVE CHANGES'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
  },
  avatarWrapper: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#E8F5E9' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 55 },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'green',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', marginTop: 15, color: '#333' },
  formCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 3,
  },
  inputGroup: { marginBottom: 15 },
  formRow: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8, marginLeft: 4 },
  inputStyle: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  pickerContainer: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
  },
  genderToggle: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  genderBtn: { flex: 1, flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  genderBtnActive: { backgroundColor: 'green' },
  genderBtnText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#666' },
  
  // BUTTON STYLES
  submitBtn: {
    backgroundColor: 'green',
    borderRadius: 12,
    height: 55,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#A5D6A7', // Lighter green when disabled
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainer: {
    width: 30, // Fixed width prevents "Loading" text from shifting
    marginLeft: 2,
  }
});