import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { DataContext } from '../../../store/GlobalState';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { postData, getData } from '../../../utils/fetchData';
import { AuthContainer } from '../../../components/AuthContainer';
import { Heading } from '../../../components/Heading';
import { Error } from '../../../components/Error';
import { Input } from '../../../components/Input';
import { FilledButton } from '../../../components/FilledButton';
import style from '../../../styles/style';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import sample_profile_avatar from '../../../assets/sample_profile_avatar.png';

export default function AppointmentDetails({ route, navigation }: any) {
  const [appointmentDetails, setAppointmentDetails] = useState(route.params.appointmentDetails);
  const { state, dispatch } = useContext(DataContext)!;
  const { auth } = state;

  const [error, setError] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [durations, setDurations] = useState<Record<string, string>>({});

  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [meetingDuration, setMeetingDuration] = useState('');
  const [note, setNote] = useState('');

  const handleDirectAccept = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(`employee/appointment/${appointmentDetails.id}/accept`, auth.token!);
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      let errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show(res.message, ToastAndroid.LONG);
    navigation.pop();
  };

  const handleRejectSubmit = async () => {
    if (!note) return setError('Please fill required fields');

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData(
      `employee/appointment/${appointmentDetails.id}/reject`,
      { note },
      auth.token!
    );
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      let errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show(res.message, ToastAndroid.LONG);
    setShowRejectModal(false);
    setAppointmentDetails({ ...appointmentDetails, status: 'Rejected' });
    setNote('');
    setError('');
  };

  const handleCompleteSubmit = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(
      `employee/appointment/${appointmentDetails.id}/completed`,
      auth.token!
    );
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      let errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show(res.message, ToastAndroid.LONG);
    setAppointmentDetails({ ...appointmentDetails, status: 'Completed' });
  };

  const handleAcceptSubmit = async () => {
    if (!meetingDate || !meetingTime || !meetingDuration) {
      return setError('Please fill required fields');
    }

    const formData = {
      meeting_date: moment(meetingDate).format('YYYY-MM-DD'),
      meeting_time: moment(meetingTime).format('LT'),
      meeting_duration: meetingDuration,
      note,
    };

    dispatch({ type: 'LOADING', payload: true });
    const res = await postData(
      `employee/appointment/${appointmentDetails.id}/accept`,
      formData,
      auth.token!
    );
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
      return;
    }
    if (res.errors) {
      let errorText = Object.values(res.errors).flat().join('\n');
      ToastAndroid.show(errorText, ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show('Approved', ToastAndroid.LONG);
    setShowAcceptModal(false);
    setAppointmentDetails(res.data);
    clearFields();
  };

  const clearFields = () => {
    setMeetingDate(new Date());
    setMeetingTime(new Date());
    setMeetingDuration('');
    setNote('');
    setError('');
  };

  const handleOnShowAcceptModal = () => {
    setMeetingDate(new Date(appointmentDetails.meeting.day));
    setMeetingTime(moment(appointmentDetails.meeting.time, 'HH:mm A').toDate());
    if (appointmentDetails.meeting.duration_minutes in durations) {
      setMeetingDuration(appointmentDetails.meeting.duration_minutes);
    }
    setNote(appointmentDetails.meeting.note || '');
  };

  const getDurations = async () => {
    const res = await getData('appointment/durations', auth.token!);
    setDurations(res.data);
  };

  const confirmDialog = (title: string, subTitle: string, onConfirm: () => void) => {
    Alert.alert(title, subTitle, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: onConfirm },
    ]);
  };

  useEffect(() => {
    getDurations();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 15 }}>
      <View style={{ backgroundColor: '#FFF', flex: 1, borderRadius: 8 }}>
        <ScrollView style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatarImg}
                source={
                  appointmentDetails.from.image
                    ? { uri: appointmentDetails.from.image }
                    : sample_profile_avatar
                }
              />
            </View>
            <Text style={styles.userName}>{appointmentDetails.from.name}</Text>
            <Text style={styles.phone}>{appointmentDetails.from.phone}</Text>
          </View>

          {/* Details */}
          {[
            { label: 'Appointment Date', value: moment(appointmentDetails.meeting.day).format('DD MMM, YYYY') },
            { label: 'Appointment Time', value: appointmentDetails.meeting.time },
            { label: 'Appointment Duration', value: appointmentDetails.meeting.duration },
            { label: 'Number of Person', value: appointmentDetails.number_of_person },
            { label: 'Purpose', value: appointmentDetails.purpose },
            { label: 'Note', value: appointmentDetails.meeting.note },
            { label: 'Status', value: appointmentDetails.status },
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

        {/* Action Buttons */}
        {appointmentDetails.status === 'Pending' && (
          <View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: 'green' }]}
                onPress={() => confirmDialog('Accept!', 'Are you sure?', handleDirectAccept)}
              >
                <Icon name="md-checkmark-outline" size={20} color="#FFF" />
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: 'red' }]}
                onPress={() => setShowRejectModal(true)}
              >
                <Icon name="md-close-outline" size={20} color="#FFF" />
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', padding: 15 }}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: 'navy', width: '48%' }]}
                onPress={() => setShowAcceptModal(true)}
              >
                <Icon name="md-checkmark-outline" size={20} color="#FFF" />
                <Text style={styles.btnText}>Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {appointmentDetails.status === 'Approved' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: 'green', width: '100%' }]}
              onPress={() => confirmDialog('Complete!', 'Are you sure?', handleCompleteSubmit)}
            >
              <Icon name="md-checkmark-outline" size={20} color="#FFF" />
              <Text style={styles.btnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Reject Modal */}
      <Modal visible={showRejectModal} animationType="slide">
        <AuthContainer>
          <TouchableOpacity onPress={() => { setShowRejectModal(false); clearFields(); }}>
            <Icon name="chevron-down" size={30} color="red" />
          </TouchableOpacity>
          <Heading style={styles.title}>REJECT APPOINTMENT</Heading>
          <Error error={error} />
          <ScrollView>
            <Text style={style.formLebel}>Note:</Text>
            <Input
              style={styles.input}
              placeholder="note"
              value={note}
              onChangeText={setNote}
            />
            <FilledButton
              title="Submit"
              style={styles.loginButton}
              onPress={() => confirmDialog('Reject!', 'Are you sure?', handleRejectSubmit)}
            />
          </ScrollView>
        </AuthContainer>
      </Modal>

      {/* Accept Modal */}
      <Modal visible={showAcceptModal} animationType="slide" onShow={handleOnShowAcceptModal}>
        <AuthContainer>
          <TouchableOpacity onPress={() => { setShowAcceptModal(false); clearFields(); }}>
            <Icon name="chevron-down" size={30} color="red" />
          </TouchableOpacity>
          <Heading style={styles.title}>ACCEPT APPOINTMENT</Heading>
          <Error error={error} />
          <ScrollView>
            <Text style={style.formLebel}>Meeting Date:</Text>
            <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
              <Input
                style={styles.input}
                value={moment(meetingDate).format('YYYY-MM-DD')}
                editable={false}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openDatePicker}
              date={meetingDate}
              onConfirm={(date) => {
                setOpenDatePicker(false);
                setMeetingDate(date);
              }}
              onCancel={() => setOpenDatePicker(false)}
            />

            <Text style={style.formLebel}>Meeting Time:</Text>
            <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
              <Input
                style={styles.input}
                value={moment(meetingTime).format('LT')}
                editable={false}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              mode="time"
              open={openTimePicker}
              date={meetingTime}
              onConfirm={(time) => {
                setOpenTimePicker(false);
                setMeetingTime(time);
              }}
              onCancel={() => setOpenTimePicker(false)}
            />

            <Text style={style.formLebel}>Meeting Duration:</Text>
            <Picker
              selectedValue={meetingDuration}
              style={styles.picker}
              onValueChange={(value) => setMeetingDuration(value)}
            >
              <Picker.Item label="Select meeting duration" value="" />
              {Object.entries(durations).map(([value, label]) => (
                <Picker.Item key={value} label={label} value={value} />
              ))}
            </Picker>

            <Text style={style.formLebel}>Note (optional):</Text>
            <Input
              style={styles.input}
              placeholder="note"
              value={note}
              onChangeText={setNote}
            />

            <FilledButton
              title="Submit"
              style={styles.loginButton}
              onPress={() => confirmDialog('Accept!', 'Are you sure?', handleAcceptSubmit)}
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
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    marginVertical: 10,
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
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
  row: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    flexDirection: 'row',
  },
  col: { width: '50%', alignItems: 'center' },
  label: { fontSize: 16, color: '#000', marginVertical: 15 },
  value: { fontSize: 14, color: '#000', marginVertical: 15 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionBtn: {
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontSize: 16, marginLeft: 5 },
  loginButton: { marginVertical: 10 },
});