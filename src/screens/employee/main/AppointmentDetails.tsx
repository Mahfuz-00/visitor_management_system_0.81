import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ToastAndroid,
  TouchableWithoutFeedback,
} from 'react-native';
import { DataContext } from '../../../store/GlobalState';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { getData, postData } from '../../../utils/fetchData';
import { Heading } from '../../../components/Heading';
import { Error } from '../../../components/Error';
import { Input } from '../../../components/Input';
import { FilledButton } from '../../../components/FilledButton';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import sample_profile_avatar from '../../../assets/sample_profile_avatar.png';
import { ACTIONS } from '../../../store/Actions';

export default function AppointmentDetails({ route, navigation }: any) {
  const [appointmentDetails, setAppointmentDetails] = useState(route.params?.appointmentDetails || {});
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state; // ✅ Destructured language

  const [error, setError] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const [durations, setDurations] = useState<Record<string, string>>({});
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [meetingDuration, setMeetingDuration] = useState('');
  
  const [reviewNote, setReviewNote] = useState('');
  const [rejectNote, setRejectNote] = useState('');

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const m = moment(dateStr, ['DD MMMM, YYYY', 'YYYY-MM-DD']);
    return m.isValid() ? m.format('DD MMM, YYYY') : dateStr;
  };

  const handleOnShowAcceptModal = () => {
    setError('');
    const rawDay = appointmentDetails.meeting?.day;
    const rawTime = appointmentDetails.meeting?.time;

    const initialDate = moment(rawDay, ['DD MMMM, YYYY', 'YYYY-MM-DD']).isValid()
      ? moment(rawDay, ['DD MMMM, YYYY', 'YYYY-MM-DD']).toDate()
      : new Date();

    const initialTime = moment(rawTime, 'HH:mm A').isValid()
      ? moment(rawTime, 'HH:mm A').toDate()
      : new Date();

    setMeetingDate(initialDate);
    setMeetingTime(initialTime);
    setReviewNote(appointmentDetails.meeting?.note || '');
  };

  const handleAcceptSubmit = async () => {
    if (!meetingDuration) return setError(language === 'EN' ? 'Please select duration' : 'অনুগ্রহ করে সময়সীমা নির্বাচন করুন');

    const formData = {
      meeting_date: moment(meetingDate).format('YYYY-MM-DD'),
      meeting_time: moment(meetingTime).format('hh:mm A'),
      meeting_duration: meetingDuration,
      note: reviewNote,
    };

    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await postData(`employee/appointment/${appointmentDetails.id}/accept`, formData, auth.token!);
    dispatch({ type: ACTIONS.LOADING, payload: false });

    if (res.errorMessage) return ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
    setShowAcceptModal(false);
    navigation.goBack();
  };

  const handleDirectAccept = async () => {
    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await getData(`employee/appointment/${appointmentDetails.id}/accept`, auth.token!);
    dispatch({ type: ACTIONS.LOADING, payload: false });
    if (res.errorMessage) return ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
    navigation.goBack();
  };

  const handleRejectSubmit = async () => {
    if (!rejectNote) return setError(language === 'EN' ? 'Reason is required' : 'কারণ জানানো আবশ্যক');
    dispatch({ type: ACTIONS.LOADING, payload: true });
    const res = await postData(`employee/appointment/${appointmentDetails.id}/reject`, { note: rejectNote }, auth.token!);
    dispatch({ type: ACTIONS.LOADING, payload: false });
    if (res.errorMessage) return ToastAndroid.show(res.errorMessage, ToastAndroid.LONG);
    setShowRejectModal(false);
    navigation.goBack();
  };

  useEffect(() => {
    const getDurations = async () => {
      const res = await getData('appointment/durations', auth.token!);
      if (res.data) setDurations(res.data);
    };
    getDurations();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarBorder}>
            <Image
              style={styles.avatarImg}
              source={appointmentDetails.from?.image ? { uri: appointmentDetails.from.image } : sample_profile_avatar}
            />
          </View>
          <Text style={styles.userName}>{appointmentDetails.from?.name || (language === 'EN' ? 'Unknown' : 'অজানা')}</Text>
          <Text style={styles.phoneText}>{appointmentDetails.from?.phone || ''}</Text>
        </View>

        <View style={styles.infoCard}>
          {[
            { label: language === 'EN' ? 'Date' : 'তারিখ', value: formatDate(appointmentDetails.meeting?.day), icon: 'calendar-outline' },
            { label: language === 'EN' ? 'Time' : 'সময়', value: appointmentDetails.meeting?.time || 'N/A', icon: 'time-outline' },
            { label: language === 'EN' ? 'Duration' : 'সময়সীমা', value: appointmentDetails.meeting?.duration || 'N/A', icon: 'hourglass-outline' },
            { label: language === 'EN' ? 'Persons' : 'ব্যক্তি সংখ্যা', value: appointmentDetails.number_of_person || '1', icon: 'people-outline' },
            { label: language === 'EN' ? 'Purpose' : 'উদ্দেশ্য', value: appointmentDetails.purpose || 'N/A', icon: 'bookmark-outline' },
            { label: language === 'EN' ? 'Note' : 'নোট', value: appointmentDetails.meeting?.note || 'N/A', icon: 'chatbox-ellipses-outline' },
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
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.stickyFooter}>
        {appointmentDetails.status === 'Pending' && (
          <>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#2E7D32', flex: 1, marginRight: 5 }]} onPress={() => handleDirectAccept()}>
              <Icon name="checkmark-done" size={18} color="#FFF" />
              <Text style={styles.btnLabel}>{language === 'EN' ? 'Accept' : 'গ্রহণ করুন'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#1565C0', flex: 1, marginRight: 5 }]} onPress={() => setShowAcceptModal(true)}>
              <Icon name="create" size={18} color="#FFF" />
              <Text style={styles.btnLabel}>{language === 'EN' ? 'Review' : 'রিভিউ'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#D32F2F', flex: 1 }]} onPress={() => setShowRejectModal(true)}>
              <Icon name="close-circle" size={18} color="#FFF" />
              <Text style={styles.btnLabel}>{language === 'EN' ? 'Reject' : 'বাতিল করুন'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* REVIEW MODAL */}
      <Modal animationType="slide" transparent visible={showAcceptModal} onShow={handleOnShowAcceptModal} onRequestClose={() => setShowAcceptModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAcceptModal(false)}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Heading style={{ color: '#2E7D32', fontSize: 18 }}>{language === 'EN' ? 'Review Appointment' : 'অ্যাপয়েন্টমেন্ট রিভিউ'}</Heading>
                <TouchableOpacity onPress={() => setShowAcceptModal(false)}><Icon name="close-circle" size={28} color="#D32F2F" /></TouchableOpacity>
              </View>
              <Error error={error} />

              <Text style={styles.formLabel}>{language === 'EN' ? 'Date & Time' : 'তারিখ ও সময়'}</Text>
              <View style={styles.formRow}>
                <TouchableOpacity style={[styles.inputContainer, { flex: 1, marginRight: 5 }]} onPress={() => setOpenDatePicker(true)}>
                  <Text>{moment(meetingDate).format('YYYY-MM-DD')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.inputContainer, { flex: 1 }]} onPress={() => setOpenTimePicker(true)}>
                  <Text>{moment(meetingTime).format('hh:mm A')}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabel}>{language === 'EN' ? 'Duration' : 'সময়সীমা'}</Text>
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={meetingDuration} onValueChange={(v) => setMeetingDuration(v)}>
                  <Picker.Item label={language === 'EN' ? "Select Duration" : "সময়সীমা নির্বাচন করুন"} value="" />
                  {Object.entries(durations).map(([v, l]) => <Picker.Item key={v} label={l} value={v} />)}
                </Picker>
              </View>

              <Text style={styles.formLabel}>{language === 'EN' ? 'Note (Optional)' : 'নোট (ঐচ্ছিক)'}</Text>
              <Input
                style={styles.reviewNoteInput}
                placeholder={language === 'EN' ? "Add a note..." : "কিছু লিখুন..."}
                value={reviewNote}
                onChangeText={setReviewNote}
                multiline={true}
                numberOfLines={2}
                maxLength={60}
              />

              <FilledButton title={language === 'EN' ? "Approve Changes" : "পরিবর্তন অনুমোদন করুন"} style={{ backgroundColor: 'green', marginTop: 15 }} onPress={handleAcceptSubmit} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* REJECT MODAL */}
      <Modal animationType="fade" transparent visible={showRejectModal} onShow={() => { setError(''); setRejectNote(''); }} onRequestClose={() => setShowRejectModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRejectModal(false)}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { height: 320 }]}>
              <View style={styles.modalHeader}>
                <Heading style={{ color: 'red', fontSize: 18 }}>{language === 'EN' ? 'Reject Request' : 'অনুরোধ বাতিল করুন'}</Heading>
                <TouchableOpacity onPress={() => setShowRejectModal(false)}>
                  <Icon name="close-circle" size={28} color="#D32F2F" />
                </TouchableOpacity>
              </View>
              <Error error={error} />
              <Text style={styles.formLabel}>{language === 'EN' ? 'Reason' : 'কারণ'}</Text>
              <Input 
                style={styles.reviewNoteInput} 
                placeholder={language === 'EN' ? "Why are you rejecting?" : "কেন বাতিল করছেন?"} 
                value={rejectNote} 
                onChangeText={setRejectNote} 
                multiline 
                numberOfLines={2} 
                maxLength={60} 
              />
              <FilledButton title={language === 'EN' ? "Confirm Rejection" : "বাতিল নিশ্চিত করুন"} style={{ backgroundColor: 'red', marginTop: 20 }} onPress={handleRejectSubmit} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      <DatePicker modal mode="date" open={openDatePicker} date={meetingDate} onConfirm={d => { setOpenDatePicker(false); setMeetingDate(d); }} onCancel={() => setOpenDatePicker(false)} />
      <DatePicker modal mode="time" open={openTimePicker} date={meetingTime} onConfirm={t => { setOpenTimePicker(false); setMeetingTime(t); }} onCancel={() => setOpenTimePicker(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  cardHeader: { backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 16, paddingVertical: 20, borderRadius: 16, alignItems: 'center', elevation: 2 },
  avatarBorder: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#E8F5E9', padding: 2 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 40 },
  userName: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 10 },
  phoneText: { fontSize: 13, color: '#D32F2F', fontWeight: 'bold' },
  infoCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 12, borderRadius: 16, paddingVertical: 5, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  labelGroup: { flexDirection: 'row', alignItems: 'center', flex: 0.4 },
  labelText: { fontSize: 13, color: '#666', marginLeft: 8 },
  valueText: { fontSize: 13, color: '#000', fontWeight: '700', flex: 0.6, textAlign: 'right' },
  stickyFooter: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#EEE' },
  btn: { height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  btnLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  formLabel: { fontSize: 12, color: '#666', marginBottom: 5, marginTop: 10 },
  formRow: { flexDirection: 'row', justifyContent: 'space-between' },
  inputContainer: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: 10, height: 45, justifyContent: 'center' },
  pickerWrapper: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, height: 45, justifyContent: 'center' },
  reviewNoteInput: {
    height: 65,
    textAlignVertical: 'top',
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD'
  }
});