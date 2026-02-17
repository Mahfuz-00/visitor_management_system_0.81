import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ToastAndroid,
} from 'react-native';
import { DataContext } from '../../store/GlobalState';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { getData, postData, baseUrl } from '../../utils/fetchData';
import { AuthContainer } from '../../components/AuthContainer';
import { Heading } from '../../components/Heading';
import { Error } from '../../components/Error';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import style from '../../styles/style';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import { SvgUri } from 'react-native-svg';

export default function AppointmentDetails({ route, navigation }: any) {
  const [appointmentDetails, setAppointmentDetails] = useState(route.params.appointmentDetails);
  const { state, dispatch} = useContext(DataContext)!;
  const { auth, language } = state;

  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const [purposes, setPurposes] = useState<string[]>([]);
  const [durations, setDurations] = useState<Record<string, string>>({});

  const [personId, setPersonId] = useState('');
  const [personName, setPersonName] = useState('');
  const [noOfPerson, setNoOfPerson] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [meetingDuration, setMeetingDuration] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');

  const handleUpdateSubmit = async () => {
    if (!noOfPerson || !meetingDate || !meetingTime || !meetingDuration || !purpose) {
      return setError('Please fill required fields');
    }

    const formData = {
      person_id: personId,
      number_of_person: noOfPerson,
      meeting_date: moment(meetingDate).format('YYYY-MM-DD'),
      meeting_time: moment(meetingTime).format('HH:mm'),
      meeting_duration: meetingDuration,
      purpose,
      note,
    };

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData(`appointment/update/${appointmentDetails.id}`, formData, auth.token!);
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show('Updated!', ToastAndroid.LONG);
    setShowUpdateModal(false);
    navigation.pop();
  };

  const handleDelete = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(`appointment/delete/${appointmentDetails.id}`, auth.token!);
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show(res.successMessage || 'Deleted!', ToastAndroid.LONG);
    navigation.pop();
  };

  const handleAction = async (action: 'accept' | 'reject') => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(`appointment/${appointmentDetails.id}/action/${action}`, auth.token!);
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      const errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show(res.successMessage || 'Success', ToastAndroid.LONG);
    setAppointmentDetails({ ...appointmentDetails, status: action === 'accept' ? 'Approved' : 'Rejected' });
  };

  const confirmDialog = (title: string, subTitle: string, onConfirm: () => void) => {
    Alert.alert(title, subTitle, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: onConfirm },
    ]);
  };

  const handleOnShowUpdateModal = () => {
    setPersonId(appointmentDetails.to.id);
    setPersonName(appointmentDetails.to.name);
    setNoOfPerson(appointmentDetails.number_of_person);
    setMeetingDate(new Date(appointmentDetails.meeting.day));
    setMeetingTime(moment(appointmentDetails.meeting.time, 'HH:mm A').toDate());
    setMeetingDuration(
      Object.keys(durations).find(k => durations[k] === appointmentDetails.meeting.duration) || ''
    );
    setPurpose(appointmentDetails.purpose);
    setNote(appointmentDetails.meeting.note || '');
  };

  const clearFields = () => {
    setNoOfPerson('');
    setMeetingDate(new Date());
    setMeetingTime(new Date());
    setMeetingDuration('');
    setNote('');
    setError('');
  };

  const getDurations = async () => {
    const res = await getData('appointment/durations', auth.token!);
    setDurations(res.data || {});
  };

  const getPurposes = async () => {
    const res = await getData('appointment/purposes', auth.token!);
    setPurposes(res.data || []);
  };

  useEffect(() => {
    getDurations();
    getPurposes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 15 }}>
      <View style={{ backgroundColor: '#FFF', flex: 1, borderRadius: 8 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Image style={styles.avatarImg} source={sample_profile_avatar} />
            </View>
            <Text style={styles.userName}>{appointmentDetails.to.name}</Text>
          </View>

          {[
            { label: 'Appointment Date', value: moment(appointmentDetails.meeting.day).format('DD MMM, YYYY') },
            { label: 'Appointment Time', value: moment(appointmentDetails.meeting.time, 'HH:mm').format('HH:mm A') },
            { label: 'Appointment Duration', value: appointmentDetails.meeting.duration },
            { label: 'Number of Person', value: appointmentDetails.number_of_person },
            { label: 'Purpose', value: appointmentDetails.purpose },
            { label: 'Note', value: appointmentDetails.meeting.note },
            { label: 'Status', value: appointmentDetails.status },
            {
              label: 'QR Code',
              value:
                appointmentDetails.qr_code ? (
                  <View style={{ height: 100, width: 100, padding: 15 }}>
                    <SvgUri width="100%" height="100%" uri={appointmentDetails.qr_code} />
                  </View>
                ) : null,
            },
          ].map((row, i) => (
            <View key={i} style={styles.row}>
              <View style={[styles.col, { borderRightWidth: 1 }]}>
                <Text style={styles.label}>{row.label}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.value}>{row.value}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {appointmentDetails.status === 'Pending confirmation' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'green' }]}
              onPress={() => confirmDialog('Accept!', 'Are you sure?', () => handleAction('accept'))}
            >
              <Icon name="md-checkmark-outline" size={20} color="#FFF" />
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'red' }]}
              onPress={() => confirmDialog('Reject!', 'Are you sure?', () => handleAction('reject'))}
            >
              <Icon name="md-close-outline" size={20} color="#FFF" />
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {appointmentDetails.status === 'Pending' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'green' }]}
              onPress={() => setShowUpdateModal(true)}
            >
              <Icon name="md-checkmark-outline" size={20} color="#FFF" />
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'red' }]}
              onPress={() => confirmDialog('Delete!', 'Are you sure?', handleDelete)}
            >
              <Icon name="md-close-outline" size={20} color="#FFF" />
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showUpdateModal} animationType="slide" transparent onRequestClose={() => setShowUpdateModal(false)}>
        <AuthContainer>
          <TouchableOpacity onPress={() => { setShowUpdateModal(false); clearFields(); }}>
            <Icon name="chevron-down" size={30} color="red" />
          </TouchableOpacity>

          <Heading style={styles.title}>UPDATE APPOINTMENT</Heading>
          <Error error={error} />
          <ScrollView>
            <Text style={style.formLebel}>{language === 'bn' ? 'কর্মকর্তার নাম' : 'Employee Name'}:</Text>
            <Input style={styles.input} value={personName} editable={false} />

            <Text style={style.formLebel}>{language === 'bn' ? 'ব্যক্তির সংখ্যা' : 'No. of Person'}:</Text>
            <Input style={styles.input} value={noOfPerson} onChangeText={setNoOfPerson} />

            <Text style={style.formLebel}>Meeting Date:</Text>
            <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
              <Input style={styles.input} value={moment(meetingDate).format('YYYY-MM-DD')} editable={false} />
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openDatePicker}
              date={meetingDate}
              onConfirm={date => { setOpenDatePicker(false); setMeetingDate(date); }}
              onCancel={() => setOpenDatePicker(false)}
            />

            <Text style={style.formLebel}>Meeting Time:</Text>
            <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
              <Input style={styles.input} value={moment(meetingTime).format('LT')} editable={false} />
            </TouchableOpacity>
            <DatePicker
              modal
              mode="time"
              open={openTimePicker}
              date={meetingTime}
              onConfirm={time => { setOpenTimePicker(false); setMeetingTime(time); }}
              onCancel={() => setOpenTimePicker(false)}
            />

            <Text style={style.formLebel}>Meeting Duration:</Text>
            <Picker
              selectedValue={meetingDuration}
              style={styles.picker}
              onValueChange={setMeetingDuration}
            >
              <Picker.Item label="Select meeting duration" value="" />
              {Object.entries(durations).map(([value, label]) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>

            <Text style={style.formLebel}>{language === 'bn' ? 'সাক্ষাতের উদ্দেশ্য' : 'Meeting Purpose'}:</Text>
            <Picker
              selectedValue={purpose}
              style={styles.picker}
              onValueChange={setPurpose}
            >
              <Picker.Item label="Select meeting purpose" value="" />
              {purposes.map((item, i) => (
                <Picker.Item key={i} label={item} value={item} />
              ))}
            </Picker>

            <Text style={style.formLebel}>Note (optional):</Text>
            <Input style={styles.input} value={note} onChangeText={setNote} />

            <FilledButton
              title="Submit"
              style={styles.loginButton}
              onPress={() => confirmDialog('Update!', 'Are you sure?', handleUpdateSubmit)}
            />
          </ScrollView>
        </AuthContainer>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { marginVertical: 20, fontWeight: 'bold', fontSize: 20 },
  input: { marginVertical: 10 },
  loginButton: { marginVertical: 10 },
  picker: { height: 50, backgroundColor: '#e8e8e8', borderRadius: 8, marginVertical: 10 },
  header: { borderBottomWidth: 0.5, borderBottomColor: 'grey', alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 150, height: 150, borderRadius: 75, overflow: 'hidden', borderWidth: 1, borderColor: 'green', elevation: 5 },
  avatarImg: { width: '100%', height: '100%' },
  userName: { fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  row: { borderBottomWidth: 0.5, borderBottomColor: 'grey', flexDirection: 'row' },
  col: { width: '50%', alignItems: 'center' },
  label: { fontSize: 16, color: '#000', marginVertical: 15 },
  value: { fontSize: 14, color: '#000', marginVertical: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  actionBtn: { padding: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '48%' },
  btnText: { color: '#FFF', fontSize: 16, marginLeft: 5 },
});