import React, { useState, useEffect, useContext } from 'react';
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
  Platform
} from 'react-native';
import { DataContext } from './../../store/GlobalState';
import { postData, getData } from '../../utils/fetchData';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import moment from 'moment';
import { useIsFocused } from "@react-navigation/native";
import { Error } from '../../components/Error';
import { Input } from './../../components/Input';
import { FilledButton } from './../../components/FilledButton';
import { Picker } from '@react-native-picker/picker';
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

  const [employees, setEmployees] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [purposes, setPurposes] = useState<any[]>([]);
  const [durations, setDurations] = useState<any>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);

  // ✅ These now persist because handleSearch runs when allEmployees updates
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
              setAllEmployees(emp.data.data || []);
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

  const handleSearch = () => {
    let filtered = allEmployees;
    if (searchKeyword) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchKeyword.toLowerCase()));
    }
    if (searchDepartment) {
      filtered = filtered.filter(item => item.department === searchDepartment);
    }
    if (searchDesignation) {
      filtered = filtered.filter(item => item.designation === searchDesignation);
    }
    setEmployees(filtered);
  };

  // ✅ Keep filters active when data reloads or keywords change
  useEffect(() => {
    handleSearch();
  }, [searchDepartment, searchDesignation, searchKeyword, allEmployees]);

  const addMeeting = () => {
    if (!meetingDuration) return ToastAndroid.show(language === 'BN' ? "সময়সীমা নির্বাচন করুন" : "Select Duration", ToastAndroid.SHORT);
    setMeetings([{ meetingDate, meetingTime, meetingDuration }]); 
  };

  const removeMeeting = () => {
    setMeetings([]);
  };

  const handleSubmit = async () => {
    if (meetings.length === 0) {
      return Alert.alert(language === 'BN' ? "প্রয়োজনীয়" : "Required", language === 'BN' ? "অনুগ্রহ করে একটি মিটিং স্লট যোগ করুন।" : "Please add a meeting slot.");
    }
    if (!noOfPerson || !purpose) return setError(language === 'BN' ? "সবগুলো ঘর পূরণ করুন" : "Fill required fields");

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
          <Icon name="search" size={18} color="#999" style={{marginLeft: 12}} />
          <Input
            style={styles.searchInput}
            placeholder={language === 'BN' ? 'নাম দিয়ে সার্চ করুন' : 'Search employees...'}
            value={searchKeyword}
            onChangeText={setSearchKeyword}
            multiline={false} // ✅ Fixed height/one line
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel}>{language === 'BN' ? 'বিভাগ' : 'Department'}</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={searchDepartment} onValueChange={setSearchDepartment} dropdownIconColor="green">
                <Picker.Item label={language === 'BN' ? 'সব' : 'All'} value="" color="black" />
                {departments.map((item, i) => (
                    <Picker.Item key={i} label={item.name || item} value={item.name || item} color="black" />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel}>{language === 'BN' ? 'পদবী' : 'Designation'}</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={searchDesignation} onValueChange={setSearchDesignation} dropdownIconColor="green">
                <Picker.Item label={language === 'BN' ? 'সব' : 'All'} value="" color="black" />
                {designations.map((item, i) => (
                    <Picker.Item key={i} label={item.name || item} value={item.name || item} color="black" />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {employees.length === 0 && !state.loading ? (
            <Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>
                {language === 'BN' ? 'কোনো তথ্য পাওয়া যায়নি' : 'No results found'}
            </Text>
        ) : (
            employees.map((item, index) => (
                <TouchableOpacity key={index} style={styles.employeeCard} onPress={() => { setPersonId(item.id); setPersonName(item.name); setShowModal(true); }}>
                  <View style={styles.avatarCircle}><Image style={styles.avatarImg} source={item.image ? { uri: item.image } : sample_profile_avatar} /></View>
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

      {/* NEW APPOINTMENT MODAL */}
      <Modal visible={showModal} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowModal(false); resetForm(); }}>
              <Icon name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{language === 'BN' ? 'নতুন অ্যাপয়েন্টমেন্ট তৈরি করুন' : 'Create Appointment'}</Text>
            <View style={{width: 28}} />
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {error ? <View style={{marginBottom: 10}}><Error error={error} /></View> : null}
            
            <View style={styles.formSection}>
                <View style={styles.employeeHighlight}>
                    <Icon name="person-circle-outline" size={36} color="green" />
                    <View style={{marginLeft: 12}}>
                        <Text style={styles.highlightLabel}>{language === 'BN' ? 'মিটিং যার সাথে' : 'Meeting With'}</Text>
                        <Text style={styles.highlightValue}>{personName}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.sectionHeading}>{language === 'BN' ? 'সাধারণ তথ্য' : 'Basic Information'}</Text>
                
                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{language === 'BN' ? 'দর্শনার্থীর সংখ্যা' : 'Number of Visitors'}</Text>
                    <div style={styles.iconInput}>
                        <Icon name="people-outline" size={20} color="green" />
                        <Input 
                          style={styles.cleanInput} 
                          value={noOfPerson} 
                          onChangeText={setNoOfPerson} 
                          keyboardType="numeric" 
                          placeholder="e.g. 2" 
                          multiline={false}
                          scrollEnabled={false}
                        />
                    </div>
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{language === 'BN' ? 'মিটিংয়ের উদ্দেশ্য' : 'Meeting Purpose'}</Text>
                    <View style={styles.pickerContainer}>
                        <Icon name="bookmark-outline" size={20} color="green" style={{marginLeft: 10}} />
                        <Picker style={{flex: 1}} selectedValue={purpose} onValueChange={setPurpose}>
                            <Picker.Item label={language === 'BN' ? "উদ্দেশ্য নির্বাচন করুন..." : "Select Purpose..."} value="" color="black" />
                            {purposes.map((p, i) => <Picker.Item key={i} label={p} value={p} color="black" />)}
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.sectionHeading}>{language === 'BN' ? 'শিডিউল স্লট' : 'Schedule Slot'}</Text>
                
                {meetings.length === 0 ? (
                  <>
                    <Text style={styles.sectionSub}>{language === 'BN' ? 'তারিখ, সময় এবং সময়সীমা নির্বাচন করুন।' : 'Pick date, time, and duration.'}</Text>
                    <View style={styles.slotPickerRow}>
                        <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setOpenDatePicker(true)}>
                            <Icon name="calendar-outline" size={18} color="green" />
                            <Text style={styles.dateTimeText}>{moment(meetingDate).format('DD MMM')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setOpenTimePicker(true)}>
                            <Icon name="time-outline" size={18} color="green" />
                            <Text style={styles.dateTimeText}>{moment(meetingTime).format('hh:mm A')}</Text>
                        </TouchableOpacity>

                        <View style={styles.durationPicker}>
                            <Picker selectedValue={meetingDuration} onValueChange={setMeetingDuration}>
                                <Picker.Item label={language === 'BN' ? "সময়" : "Dur"} value="" color="black" />
                                {Object.keys(durations).map((k) => <Picker.Item key={k} label={durations[k]} value={k} color="black" />)}
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.addSlotButton} onPress={addMeeting}>
                        <Icon name="add" size={20} color="#FFF" />
                        <Text style={styles.addSlotText}>{language === 'BN' ? 'স্লট যোগ করুন' : 'Add Slot'}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  meetings.map((m, i) => (
                    <View key={i} style={styles.addedSlotCard}>
                        <View>
                            <Text style={styles.slotMain}>{moment(m.meetingDate).format('DD MMM')} • {moment(m.meetingTime).format('hh:mm A')}</Text>
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
                    multiline={true} // ✅ Overrides default single line
                    maxLength={70}
                    placeholder={language === 'BN' ? 'অন্য কিছু?' : 'Anything else?'} 
                />
            </View>

            <FilledButton 
                title={loading ? (language === 'BN' ? "অনুরোধ পাঠানো হচ্ছে..." : "Sending Request...") : (language === 'BN' ? "সাবমিট করুন" : "SUBMIT APPOINTMENT")} 
                onPress={handleSubmit} 
                style={styles.finalSubmitBtn}
            />
            <View style={{height: 30}} />
          </ScrollView>
        </View>

        <DatePicker modal mode="date" open={openDatePicker} date={meetingDate} onConfirm={d => {setOpenDatePicker(false); setMeetingDate(d)}} onCancel={() => setOpenDatePicker(false)} />
        <DatePicker modal mode="time" open={openTimePicker} date={meetingTime} onConfirm={t => {setOpenTimePicker(false); setMeetingTime(t)}} onCancel={() => setOpenTimePicker(false)} />
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
  pickerWrapper: { backgroundColor: '#F3F4F6', borderRadius: 10, height: 42, justifyContent: 'center' },
  employeeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 18, marginBottom: 12, elevation: 2 },
  avatarCircle: { width: 55, height: 55, borderRadius: 27.5, overflow: 'hidden', borderColor: '#EEE' },
  avatarImg: { width: '100%', height: '100%' },
  empInfo: { flex: 1, marginLeft: 15 },
  empName: { fontSize: 17, fontWeight: '700', color: '#333' },
  empSub: { fontSize: 13, color: '#666', marginTop: 1 },
  deptBadge: { fontSize: 11, color: 'green', fontWeight: 'bold', backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 5 },
  modalBg: { flex: 1, backgroundColor: '#F8F9FA' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalScroll: { paddingHorizontal: 15, paddingTop: 10 },
  formSection: { marginBottom: 10 },
  employeeHighlight: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#C8E6C9' },
  highlightLabel: { fontSize: 11, color: '#4CAF50', fontWeight: 'bold' },
  highlightValue: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  formCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 12, elevation: 1 },
  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#888', marginBottom: 10 },
  inputWrapper: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 6, marginLeft: 4 },
  iconInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#EEE', height: 48 },
  cleanInput: { flex: 1, height: 48, marginLeft: 10, fontSize: 14, textAlignVertical: 'center', color: 'black' },
  pickerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', height: 48 },
  slotPickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dateTimeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F9F9', height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', marginRight: 8 },
  dateTimeText: { fontSize: 12, fontWeight: '600', marginLeft: 6, color: '#333' },
  durationPicker: { flex: 1, backgroundColor: '#F9F9F9', height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center' },
  addSlotButton: { backgroundColor: '#333', height: 42, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  addSlotText: { color: '#FFF', fontWeight: 'bold', fontSize: 13, marginLeft: 5 },
  addedSlotCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F1F1F1', padding: 10, borderRadius: 12, marginBottom: 6 },
  slotMain: { fontWeight: 'bold', fontSize: 13, color: '#333' },
  slotSub: { fontSize: 11, color: '#666' },
  textArea: { backgroundColor: '#F9F9F9', borderRadius: 12, borderWidth: 1, borderColor: '#EEE', padding: 10, marginTop: 10, height: 80, textAlignVertical: 'top', color: 'black' },
  finalSubmitBtn: { backgroundColor: 'green', height: 50, borderRadius: 15, marginTop: 5 },
});

export default EmployeeList;