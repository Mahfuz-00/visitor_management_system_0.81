import React, { useContext, useState, useEffect } from 'react';
import {
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
import { getData, postData } from '../../utils/fetchData';
import { Heading } from '../../components/Heading';
import { Error } from '../../components/Error';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import { SvgUri } from 'react-native-svg';

export default function AppointmentDetails({ route, navigation }: any) {
  const [appointmentDetails, setAppointmentDetails] = useState(route.params.appointmentDetails);
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state; // ✅ Destructured language

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

  const formatDate = (dateStr: string) => {
    const m = moment(dateStr, 'DD MMMM, YYYY');
    return m.isValid() ? m.format('DD MMM, YYYY') : dateStr;
  };

  const handleUpdateSubmit = async () => {
    if (!noOfPerson || !meetingDate || !meetingTime || !meetingDuration || !purpose) {
      return setError(language === 'EN' ? 'Please fill required fields' : 'সবগুলো ঘর পূরণ করুন');
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
    if (res.errorMessage) { ToastAndroid.show(res.errorMessage, ToastAndroid.LONG); return; }
    ToastAndroid.show(language === 'EN' ? 'Updated!' : 'আপডেট করা হয়েছে!', ToastAndroid.LONG);
    setShowUpdateModal(false);
    navigation.pop();
  };

  const handleDelete = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(`appointment/delete/${appointmentDetails.id}`, auth.token!);
    dispatch({ type: 'LOADING', payload: false });
    if (res.errorMessage) { ToastAndroid.show(res.errorMessage, ToastAndroid.LONG); return; }
    ToastAndroid.show(res.successMessage || (language === 'EN' ? 'Deleted!' : 'মুছে ফেলা হয়েছে!'), ToastAndroid.LONG);
    navigation.pop();
  };

  const handleAction = async (action: 'accept' | 'reject') => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(`appointment/${appointmentDetails.id}/action/${action}`, auth.token!);
    dispatch({ type: 'LOADING', payload: false });
    if (res.errorMessage) { ToastAndroid.show(res.errorMessage, ToastAndroid.LONG); return; }
    ToastAndroid.show(res.successMessage || (language === 'EN' ? 'Success' : 'সফল হয়েছে'), ToastAndroid.LONG);
    setAppointmentDetails({ ...appointmentDetails, status: action === 'accept' ? 'Approved' : 'Rejected' });
  };

  const confirmDialog = (title: string, subTitle: string, onConfirm: () => void) => {
    Alert.alert(
      title, 
      subTitle, 
      [
        { text: language === 'EN' ? 'Cancel' : 'বাতিল', style: 'cancel' }, 
        { text: language === 'EN' ? 'Yes' : 'হ্যাঁ', onPress: onConfirm }
      ]
    );
  };

  const handleOnShowUpdateModal = () => {
    setPersonId(appointmentDetails.to.id);
    setPersonName(appointmentDetails.to.name);
    setNoOfPerson(appointmentDetails.number_of_person);
    setMeetingDate(moment(appointmentDetails.meeting.day, 'DD MMMM, YYYY').toDate());
    setMeetingTime(moment(appointmentDetails.meeting.time, 'HH:mm A').toDate());
    setMeetingDuration(Object.keys(durations).find(k => durations[k] === appointmentDetails.meeting.duration) || '');
    setPurpose(appointmentDetails.purpose);
    setNote(appointmentDetails.meeting.note || '');
  };

  useEffect(() => {
    const fetchData = async () => {
      const resD = await getData('appointment/durations', auth.token!);
      setDurations(resD.data || {});
      const resP = await getData('appointment/purposes', auth.token!);
      setPurposes(resP.data || []);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.scrollInside}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarBorder}>
              <Image style={styles.avatarImg} source={sample_profile_avatar} />
            </View>
            <Text style={styles.userName}>{appointmentDetails.to.name}</Text>
            <View style={[styles.statusTag, { backgroundColor: appointmentDetails.status === 'Approved' ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, { color: appointmentDetails.status === 'Approved' ? 'green' : 'red' }]}>
                {appointmentDetails.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            {[
              { label: language === 'EN' ? 'Date' : 'তারিখ', value: formatDate(appointmentDetails.meeting.day), icon: 'calendar-outline' },
              { label: language === 'EN' ? 'Time' : 'সময়', value: moment(appointmentDetails.meeting.time, 'HH:mm').format('hh:mm A'), icon: 'time-outline' },
              { label: language === 'EN' ? 'Duration' : 'সময়সীমা', value: appointmentDetails.meeting.duration, icon: 'hourglass-outline' },
              { label: language === 'EN' ? 'Persons' : 'ব্যক্তি সংখ্যা', value: appointmentDetails.number_of_person, icon: 'people-outline' },
              { label: language === 'EN' ? 'Purpose' : 'উদ্দেশ্য', value: appointmentDetails.purpose, icon: 'bookmark-outline' },
              { label: language === 'EN' ? 'Note' : 'নোট', value: appointmentDetails.meeting.note || 'N/A', icon: 'chatbox-ellipses-outline' },
            ].map((row, i) => (
              <View key={i} style={[styles.infoRow, i === 5 && { borderBottomWidth: 0 }]}>
                <View style={styles.labelGroup}>
                  <Icon name={row.icon} size={18} color="green" />
                  <Text style={styles.labelText}>{row.label}</Text>
                </View>
                <Text style={styles.valueText}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.qrCard}>
            <Text style={styles.qrHeaderTitle}>
                {language === 'EN' ? 'APPOINTMENT QR CODE' : 'অ্যাপয়েন্টমেন্ট কিউআর কোড'}
            </Text>
            <View style={styles.qrContainer}>
              {appointmentDetails.qr_code ? (
                <View style={styles.qrActual}>
                  <SvgUri width="100%" height="100%" uri={appointmentDetails.qr_code} />
                </View>
              ) : (
                <View style={styles.qrActual}>
                  <Icon name="qr-code-outline" size={50} color="#EEE" />
                </View>
              )}
            </View>
            <Text style={styles.qrFooter}>
                {language === 'EN' ? 'Scanning ensures faster check-in' : 'স্ক্যান করলে দ্রুত চেক-ইন নিশ্চিত হয়'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {(appointmentDetails.status === 'Pending confirmation' || appointmentDetails.status === 'Pending') && (
        <View style={styles.stickyFooter}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#2E7D32' }]}
            onPress={() => appointmentDetails.status === 'Pending' 
                ? setShowUpdateModal(true) 
                : confirmDialog(language === 'EN' ? 'Accept!' : 'গ্রহণ করুন!', language === 'EN' ? 'Are you sure?' : 'আপনি কি নিশ্চিত?', () => handleAction('accept'))}
          >
            <Icon name={appointmentDetails.status === 'Pending' ? "create" : "checkmark-circle"} size={20} color="#FFF" />
            <Text style={styles.btnLabel}>
                {appointmentDetails.status === 'Pending' 
                    ? (language === 'EN' ? 'Update' : 'আপডেট') 
                    : (language === 'EN' ? 'Accept' : 'গ্রহণ')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#D32F2F' }]}
            onPress={() => appointmentDetails.status === 'Pending' 
                ? confirmDialog(language === 'EN' ? 'Delete!' : 'মুছে ফেলুন!', language === 'EN' ? 'Are you sure?' : 'আপনি কি নিশ্চিত?', handleDelete) 
                : confirmDialog(language === 'EN' ? 'Reject!' : 'বাতিল করুন!', language === 'EN' ? 'Are you sure?' : 'আপনি কি নিশ্চিত?', () => handleAction('reject'))}
          >
            <Icon name="trash" size={20} color="#FFF" />
            <Text style={styles.btnLabel}>
                {appointmentDetails.status === 'Pending' 
                    ? (language === 'EN' ? 'Delete' : 'মুছুন') 
                    : (language === 'EN' ? 'Reject' : 'বাতিল')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* UPDATE MODAL */}
      <Modal animationType="slide" transparent visible={showUpdateModal} onRequestClose={() => setShowUpdateModal(false)} onShow={handleOnShowUpdateModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Heading style={{ color: '#2E7D32', fontSize: 18 }}>
                  {language === 'EN' ? 'Update Appointment' : 'অ্যাপয়েন্টমেন্ট আপডেট করুন'}
              </Heading>
              <TouchableOpacity onPress={() => setShowUpdateModal(false)}>
                <Icon name="close-circle" size={28} color="#D32F2F" />
              </TouchableOpacity>
            </View>

            <Error error={error} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{language === 'EN' ? 'Employee' : 'কর্মকর্তা'}</Text>
                <View style={[styles.inputContainer, { backgroundColor: '#F0F0F0' }]}>
                  <Icon name="person" size={18} color="#888" />
                  <Text style={styles.lockedText}>{personName}</Text>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{language === 'EN' ? 'Number of Persons' : 'ব্যক্তি সংখ্যা'}</Text>
                <View style={styles.inputContainer}>
                  <Icon name="people" size={18} color="green" />
                  <Input
                    style={styles.formInput}
                    value={noOfPerson.toString()}
                    onChangeText={setNoOfPerson}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>{language === 'EN' ? 'Date' : 'তারিখ'}</Text>
                  <TouchableOpacity style={styles.inputContainer} onPress={() => setOpenDatePicker(true)}>
                    <Icon name="calendar" size={18} color="green" />
                    <Text style={styles.datePickerText}>{moment(meetingDate).format('YYYY-MM-DD')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>{language === 'EN' ? 'Time' : 'সময়'}</Text>
                  <TouchableOpacity style={styles.inputContainer} onPress={() => setOpenTimePicker(true)}>
                    <Icon name="time" size={18} color="green" />
                    <Text style={styles.datePickerText}>{moment(meetingTime).format('hh:mm A')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{language === 'EN' ? 'Duration' : 'সময়সীমা'}</Text>
                <View style={styles.pickerWrapper}>
                  <Picker selectedValue={meetingDuration} onValueChange={setMeetingDuration} dropdownIconColor="black">
                    {Object.entries(durations).map(([value, label]) => (
                      <Picker.Item key={value} label={label} value={value} color="black" />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{language === 'EN' ? 'Purpose' : 'উদ্দেশ্য'}</Text>
                <View style={styles.pickerWrapper}>
                  <Picker selectedValue={purpose} onValueChange={setPurpose} dropdownIconColor="black">
                    {purposes.map((item, i) => (
                      <Picker.Item key={i} label={item} value={item} color="black" />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{language === 'EN' ? 'Additional Note' : 'অতিরিক্ত নোট'}</Text>
                <Input
                  style={styles.textArea}
                  value={note}
                  onChangeText={setNote}
                  multiline={true}
                  scrollEnabled={true}
                  numberOfLines={2}
                  maxLength={70}
                  placeholder={language === 'EN' ? 'Anything else?' : 'অন্য কিছু?'}
                />
              </View>

              <FilledButton
                title={language === 'EN' ? "Save Changes" : "পরিবর্তন সংরক্ষণ করুন"}
                style={styles.modalSubmitBtn}
                onPress={() => confirmDialog(
                    language === 'EN' ? 'Update!' : 'আপডেট!', 
                    language === 'EN' ? 'Are you sure?' : 'আপনি কি নিশ্চিত?', 
                    handleUpdateSubmit
                )}
              />
            </ScrollView>
          </View>
        </View>

        <DatePicker modal mode="date" open={openDatePicker} date={meetingDate} onConfirm={date => { setOpenDatePicker(false); setMeetingDate(date); }} onCancel={() => setOpenDatePicker(false)} />
        <DatePicker modal mode="time" open={openTimePicker} date={meetingTime} onConfirm={time => { setOpenTimePicker(false); setMeetingTime(time); }} onCancel={() => setOpenTimePicker(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollInside: { paddingTop: 16, paddingBottom: 30 },
  cardHeader: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    paddingVertical: 25,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    padding: 2,
  },
  avatarImg: {
    width: '100%', 
    height: '100%', 
    borderRadius: 45
  },
  userName: {
    fontSize: 20, 
    fontWeight: '700', 
    color: '#333', 
    marginTop: 12, 
    textAlign: 'center'
  },
  statusTag: {
    marginTop: 8, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20
  },
  statusText: {
    fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase'
  },
  infoCard: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 12, borderRadius: 16, paddingVertical: 8, elevation: 2
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: '#F8F9FA'
  },
  labelGroup: {
    flexDirection: 'row', alignItems: 'center', flex: 0.45
  },
  labelText: { fontSize: 14, color: '#666', marginLeft: 10 },
  valueText: { fontSize: 14, color: '#000', fontWeight: '700', flex: 0.55, textAlign: 'right' },
  qrCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2, marginBottom: 10 },
  qrHeaderTitle: { fontSize: 12, fontWeight: 'bold', color: '#2E7D32', letterSpacing: 1, marginBottom: 15 },
  qrContainer: { padding: 12, backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  qrActual: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
  qrFooter: { marginTop: 10, fontSize: 11, color: '#999' },
  stickyFooter: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#EEE', elevation: 10 },
  btn: { flexDirection: 'row', height: 48, width: '48%', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },

  // MODAL STYLING
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end', // Aligns form to bottom, reduces top "empty" look
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 15, // Reduced top space
    paddingBottom: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  formGroup: { marginBottom: 12 },
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  formLabel: { fontSize: 13, color: '#555', fontWeight: '600', marginBottom: 4, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45, // Slightly slimmer inputs
  },
  noteContainer: {
    height: 60, // Fixed height for 2 lines
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  formInput: { flex: 1, fontSize: 14, color: '#000', marginLeft: 8 },
  lockedText: { marginLeft: 10, color: '#777', fontSize: 14 },
  datePickerText: { marginLeft: 10, fontSize: 14, color: '#333' },
  pickerWrapper: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    height: 45,
    justifyContent: 'center',
  },
  modalSubmitBtn: { marginTop: 15, backgroundColor: 'green', borderRadius: 12, height: 50 },
  textArea: { 
    backgroundColor: '#F9F9F9', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    padding: 10, 
    height: 80, 
    textAlignVertical: 'top', 
    color: 'black' 
  },
});