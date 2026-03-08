import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ToastAndroid,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DataContext } from './../../store/GlobalState';
import { postData, getData } from '../../utils/fetchData';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import moment from 'moment';
import { useIsFocused } from "@react-navigation/native";
import { Error } from '../../components/Error';
import { Input } from './../../components/Input';
import { FilledButton } from './../../components/FilledButton';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { ACTIONS } from '../../store/Actions';

const EmployeeList = ({ navigation }: any) => {
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state;

  const isFocused = useIsFocused();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [employees, setEmployees] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [purposes, setPurposes] = useState<any[]>([]);
  const [durations, setDurations] = useState<any>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchDesignation, setSearchDesignation] = useState('');

  const [personId, setPersonId] = useState('');
  const [personName, setPersonName] = useState('');
  const [noOfPerson, setNoOfPerson] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [meetingDuration, setMeetingDuration] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const isFirstRender = useRef(true);

  const fetchData = async () => {
    dispatch({ type: ACTIONS.LOADING, payload: true });
    try {
      const [emp, purp, dur, dept, desig] = await Promise.all([
        getData('employees', auth.token!),
        getData('appointment/purposes', auth.token!),
        getData('appointment/durations', auth.token!),
        getData('departments', auth.token!),
        getData('designations', auth.token!),
      ]);

      if (emp.data) {
        const empList = emp.data.data || [];
        setAllEmployees(empList);
        setEmployees(empList);
      }
      setPurposes(purp.data || []);
      setDurations(dur.data || {});
      setDepartments(dept.data?.data || dept.data || []);
      setDesignations(desig.data?.data || desig.data || []);
    } catch (err) {
      console.log(err);
    }
    dispatch({ type: ACTIONS.LOADING, payload: false });
  };

  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      let filtered = allEmployees;

      if (searchKeyword) {
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      if (searchDepartment) {
        filtered = filtered.filter(item => item.department === searchDepartment);
      }
      if (searchDesignation) {
        filtered = filtered.filter(item => item.designation === searchDesignation);
      }

      setEmployees(filtered);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword, searchDepartment, searchDesignation, allEmployees]);

  const addMeeting = () => {
    if (!meetingDuration) {
      return ToastAndroid.show(
        language === 'BN' ? "সময়সীমা নির্বাচন করুন" : "Select Duration",
        ToastAndroid.SHORT
      );
    }
    setMeetings([{ meetingDate, meetingTime, meetingDuration }]);
  };

  const removeMeeting = () => setMeetings([]);

  const handleSubmit = async () => {
    if (meetings.length === 0) return Alert.alert("Required", "Please add a meeting slot.");
    if (!noOfPerson || !purpose) return setError("Fill required fields");

    const formData = {
      person_id: personId,
      number_of_person: noOfPerson,
      meeting_date: meetings.map(m => moment(m.meetingDate).format('YYYY-MM-DD')),
      meeting_time: meetings.map(m => moment(m.meetingTime).format('HH:mm')),
      meeting_duration: meetings.map(m => m.meetingDuration),
      purpose,
      note
    };

    setLoading(true);
    const res = await postData('appointment/make/multiple', formData, auth.token!);
    setLoading(false);

    if (res.errorMessage) return setError(res.errorMessage);

    ToastAndroid.show(language === 'BN' ? "সফল হয়েছে" : "Success", ToastAndroid.LONG);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setMeetings([]);
    setNoOfPerson('');
    setPurpose('');
    setNote('');
    setError('');
    setMeetingDuration('');
  };

  return (
    <View style={styles.container}>
      {/* SEARCH SECTION */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={18} color="#999" style={{ marginLeft: 12 }} />
          <Input
            style={styles.searchInput}
            placeholder={language === 'BN' ? 'নাম দিয়ে সার্চ করুন' : 'Search employees...'}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            multiline={false}
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel}>{language === 'BN' ? 'বিভাগ' : 'Department'}</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={searchDepartment}
                onValueChange={setSearchDepartment}
                dropdownIconColor="green"
                mode="dialog"
                style={styles.nativePicker}
              >
                <Picker.Item label={language === 'BN' ? 'সব' : 'All'} value="" />
                {departments.map((item, i) => (
                  <Picker.Item key={i} label={item.name || item} value={item.name || item} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterBox}>
            <Text style={styles.filterLabel}>{language === 'BN' ? 'পদবী' : 'Designation'}</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={searchDesignation}
                onValueChange={setSearchDesignation}
                dropdownIconColor="green"
                mode="dialog"
                style={styles.nativePicker}
              >
                <Picker.Item label={language === 'BN' ? 'সব' : 'All'} value="" />
                {designations.map((item, i) => (
                  <Picker.Item key={i} label={item.name || item} value={item.name || item} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 15, flexGrow: 1 }}>
        {isSearching ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="green" />
            <Text style={styles.loaderText}>{language === 'BN' ? 'খোঁজা হচ্ছে...' : 'Searching...'}</Text>
          </View>
        ) : employees.length === 0 && !state.loading ? (
          <View style={styles.centerContainer}>
            <Icon name="people-sharp" size={80} color="#DDD" />
            <Text style={styles.noResultText}>
              {language === 'BN' ? 'কোনো কর্মী খুঁজে পাওয়া যায়নি' : 'No employees match your search'}
            </Text>
          </View>
        ) : (
          employees.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.employeeCard}
              onPress={() => {
                setPersonId(item.id);
                setPersonName(item.name);
                setShowModal(true);
              }}
            >
              <View style={styles.avatarCircle}>
                <Image style={styles.avatarImg} source={item.image ? { uri: item.image } : sample_profile_avatar} />
              </View>
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{item.name}</Text>
                <Text style={styles.empSub}>{item.designation}</Text>
                <Text style={styles.deptBadge}>{item.department}</Text>
              </View>
              <Icon name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
              <Icon name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {language === 'BN' ? 'নতুন অ্যাপয়েন্টমেন্ট তৈরি করুন' : 'Create Appointment'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {error ? <View style={{ marginBottom: 10 }}><Error error={error} /></View> : null}

            <View style={styles.employeeHighlight}>
              <Icon name="people-sharp" size={36} color="green" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.highlightLabel}>{language === 'BN' ? 'মিটিং যার সাথে' : 'Meeting With'}</Text>
                <Text style={styles.highlightValue}>{personName}</Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionHeading}>{language === 'BN' ? 'সাধারণ তথ্য' : 'Basic Information'}</Text>
              <Text style={styles.inputLabel}>{language === 'BN' ? 'দর্শনার্থীর সংখ্যা' : 'Number of Visitors'}</Text>
              <View style={styles.iconInput}>
                <Icon name="people-outline" size={20} color="green" />
                <Input
                  style={styles.cleanInput}
                  value={noOfPerson}
                  onChangeText={setNoOfPerson}
                  keyboardType="numeric"
                  placeholder="e.g. 2"
                  multiline={false}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>{language === 'BN' ? 'মিটিংয়ের উদ্দেশ্য' : 'Meeting Purpose'}</Text>
              <View style={styles.iconInput}>
                <Icon name="bookmark-outline" size={20} color="green" />
                <Picker
                  selectedValue={purpose}
                  onValueChange={setPurpose}
                  style={{ flex: 1, color: 'black' }}
                  dropdownIconColor="green"
                  mode="dialog"
                >
                  <Picker.Item label="Select Purpose" value="" />
                  {purposes.map((p, i) => (
                    <Picker.Item key={i} label={p} value={p} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.sectionHeading}>{language === 'BN' ? 'শিডিউল স্লট' : 'Schedule Slot'}</Text>
              {meetings.length === 0 ? (
                <>
                  <View style={styles.slotPickerRow}>
                    <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setOpenDatePicker(true)}>
                      <Icon name="calendar-outline" size={18} color="green" />
                      <Text style={styles.dateTimeText}>{moment(meetingDate).format('DD MMM')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setOpenTimePicker(true)}>
                      <Icon name="time-outline" size={18} color="green" />
                      <Text style={styles.dateTimeText}>{moment(meetingTime).format('hh:mm A')}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <View style={styles.durationPickerBorder}>
                      <Picker
                        selectedValue={meetingDuration}
                        onValueChange={setMeetingDuration}
                        style={styles.nativePicker}
                        mode="dialog"
                        dropdownIconColor="green"
                      >
                        <Picker.Item label="Duration" value="" />
                        {Object.keys(durations).map((k) => (
                          <Picker.Item key={k} label={durations[k]} value={k} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <TouchableOpacity style={[styles.addSlotButton, { marginTop: 16 }]} onPress={addMeeting}>
                    <Icon name="add" size={20} color="#FFF" />
                    <Text style={styles.addSlotText}>Add Slot</Text>
                  </TouchableOpacity>
                </>
              ) : (
                meetings.map((m, i) => (
                  <View key={i} style={styles.addedSlotCard}>
                    <View>
                      <Text style={styles.slotMain}>
                        {moment(m.meetingDate).format('DD MMM')} • {moment(m.meetingTime).format('hh:mm A')}
                      </Text>
                      <Text style={styles.slotSub}>{durations[m.meetingDuration]}</Text>
                    </View>
                    <TouchableOpacity onPress={removeMeeting}>
                      <Icon name="trash-outline" size={22} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>{language === 'BN' ? 'অতিরিক্ত নোট (ঐচ্ছিক)' : 'Additional Note (Optional)'}</Text>
              <Input
                style={styles.textArea}
                value={note}
                onChangeText={setNote}
                multiline={true}
                maxLength={70}
                placeholder="Anything else?"
              />
            </View>

            <FilledButton
              title={loading ? "Sending..." : "SUBMIT APPOINTMENT"}
              onPress={handleSubmit}
              style={styles.finalSubmitBtn}
            />
            <View style={{ height: 30 }} />
          </ScrollView>
        </View>

        <DatePicker
          modal
          mode="date"
          open={openDatePicker}
          date={meetingDate}
          onConfirm={d => { setOpenDatePicker(false); setMeetingDate(d) }}
          onCancel={() => setOpenDatePicker(false)}
        />
        <DatePicker
          modal
          mode="time"
          open={openTimePicker}
          date={meetingTime}
          onConfirm={t => { setOpenTimePicker(false); setMeetingTime(t) }}
          onCancel={() => setOpenTimePicker(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  searchSection: { backgroundColor: '#FFF', padding: 15, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 5 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 15, height: 48 },
  searchInput: { flex: 1, height: 48, marginLeft: 8, fontSize: 15, textAlignVertical: 'center' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  filterBox: { width: '48%' },
  filterLabel: { fontSize: 11, fontWeight: 'bold', color: '#888', marginBottom: 4, marginLeft: 2 },
  pickerBorder: { backgroundColor: '#F3F4F6', borderRadius: 10, height: 42, justifyContent: 'center', overflow: 'hidden' },
  durationPickerBorder: { backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', height: 48, justifyContent: 'center', overflow: 'hidden' },
  nativePicker: {
    width: '100%',
    color: 'black',
    backgroundColor: 'transparent',
    ...Platform.select({
      android: { height: 60, marginLeft: -5 },
    }),
  },
  centerContainer: { flex: 1, marginTop: 60, alignItems: 'center', justifyContent: 'center' },
  loaderText: { marginTop: 12, color: 'green', fontSize: 14, fontWeight: '600' },
  noResultText: { marginTop: 15, color: '#999', fontSize: 16, fontWeight: '500', textAlign: 'center' },
  employeeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 18, marginBottom: 12, elevation: 2 },
  avatarCircle: { width: 55, height: 55, borderRadius: 27.5, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  empInfo: { flex: 1, marginLeft: 15 },
  empName: { fontSize: 17, fontWeight: '700', color: '#333' },
  empSub: { fontSize: 13, color: '#666', marginTop: 1 },
  deptBadge: { fontSize: 11, color: 'green', fontWeight: 'bold', backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 5 },
  modalBg: { flex: 1, backgroundColor: '#F8F9FA' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalScroll: { paddingHorizontal: 15, paddingTop: 10 },
  employeeHighlight: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#C8E6C9', marginBottom: 12 },
  highlightLabel: { fontSize: 11, color: '#4CAF50', fontWeight: 'bold' },
  highlightValue: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  formCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 12, elevation: 1 },
  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 6, marginLeft: 4 },
  iconInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#EEE', height: 48 },
  cleanInput: { flex: 1, height: 48, marginLeft: 10, fontSize: 14, color: 'black' },
  slotPickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, gap: 12 },
  dateTimeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F9F9', height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  dateTimeText: { fontSize: 13, fontWeight: '600', marginLeft: 8, color: '#333' },
  addSlotButton: { backgroundColor: '#333', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  addSlotText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginLeft: 8 },
  addedSlotCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F1F1F1', padding: 12, borderRadius: 12, marginTop: 10 },
  slotMain: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  slotSub: { fontSize: 12, color: '#666' },
  textArea: { backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', padding: 12, height: 80, textAlignVertical: 'top', color: 'black' },
  finalSubmitBtn: { backgroundColor: 'green', height: 52, borderRadius: 14, marginTop: 8 },
});

export default EmployeeList;