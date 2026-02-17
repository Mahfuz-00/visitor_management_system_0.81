import React, { useContext, useState, useEffect } from 'react';
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
import { AuthContainer } from '../../components/AuthContainer';
import { Error } from '../../components/Error';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import style from '../../styles/style';
import RadioButtonRN from 'radio-buttons-react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import Icon from 'react-native-vector-icons/Ionicons';

const genderData = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export default function EditProfile({ navigation }: any) {
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state;
  const { user } = auth;

  const [error, setError] = useState('');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [nid, setNid] = useState(user.nid || '');
  const [gender, setGender] = useState(user.gender || 'male');
  const [bloodGroup, setBloodGroup] = useState(user.blood_group || '');
  const [presentAddress, setPresentAddress] = useState(user.address || '');
  const [formImage, setFormImage] = useState<any>(null);

  const handleSubmit = async () => {
    if (!name || !gender || !bloodGroup) {
      return setError('Required fields should not be empty');
    }

    const formData = {
      name,
      email,
      phone,
      nid: nid || '',
      gender,
      blood_group: bloodGroup,
      present_address: presentAddress || '',
    };

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('update/profile', formData, auth.token!);
    dispatch({ type: 'LOADING', payload: false });

    if (res.errors) {
      setError('Failed!');
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
    const result = await launchImageLibrary({ mediaType: 'photo', maxWidth: 200, maxHeight: 200 });
    if (!result.didCancel && result.assets?.[0]) {
      setFormImage(result);
    }
  };

  return (
    <AuthContainer>
      <Error error={error} />
      <ScrollView>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
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
          </View>
          <TouchableOpacity style={styles.cameraBtn} onPress={openGallery}>
            <Icon name="ios-camera-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={style.formLebel}>{language === 'bn' ? 'নাম' : 'Name'}:</Text>
        <Input style={styles.input} value={name} onChangeText={setName} />

        <Text style={style.formLebel}>{language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (optional)'}:</Text>
        <Input style={styles.input} value={email} onChangeText={setEmail} />

        <Text style={style.formLebel}>{language === 'bn' ? 'ফোন' : 'Phone'}:</Text>
        <Input style={styles.input} value={phone} onChangeText={setPhone} />

        <Text style={style.formLebel}>{language === 'bn' ? 'এনআইডি (ঐচ্ছিক)' : 'NID (optional)'}:</Text>
        <Input style={styles.input} value={nid} onChangeText={setNid} />

        <Text style={style.formLebel}>{language === 'bn' ? 'লিঙ্গ' : 'Gender'}:</Text>
        <RadioButtonRN
          data={genderData}
          selectedBtn={(e: any) => setGender(e.value)}
          initial={gender === 'female' ? 2 : 1}
          style={styles.radioRow}
          boxStyle={styles.radioBox}
        />

        <Text style={style.formLebel}>{language === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}:</Text>
        <Picker
          selectedValue={bloodGroup}
          style={styles.picker}
          onValueChange={setBloodGroup}
        >
          <Picker.Item label="Select blood group" value="" />
          {['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'].map(g => (
            <Picker.Item key={g} label={g} value={g} />
          ))}
        </Picker>

        <Text style={style.formLebel}>{language === 'bn' ? 'বর্তমান ঠিকানা (ঐচ্ছিক)' : 'Present Address (optional)'}:</Text>
        <Input style={styles.input} value={presentAddress} onChangeText={setPresentAddress} />

        <FilledButton
          title={language === 'bn' ? 'আপডেট' : 'UPDATE'}
          style={styles.loginButton}
          onPress={handleSubmit}
        />
      </ScrollView>
    </AuthContainer>
  );
}

const styles = StyleSheet.create({
  avatarContainer: { alignItems: 'center', marginVertical: 20 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'green',
    elevation: 5,
  },
  avatarImg: { width: '100%', height: '100%' },
  cameraBtn: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  input: { marginVertical: 8 },
  loginButton: { marginVertical: 20 },
  radioRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  radioBox: { width: '45%' },
  picker: { height: 50, backgroundColor: '#e8e8e8', borderRadius: 8, marginVertical: 10 },
});