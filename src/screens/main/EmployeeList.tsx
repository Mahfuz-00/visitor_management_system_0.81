import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import { DataContext } from '../../store/GlobalState';
import { postData, getData } from '../../utils/fetchData';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { AuthContainer } from '../../components/AuthContainer';
import { Heading } from '../../components/Heading';
import { Error } from '../../components/Error';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import style from '../../styles/style';
import Icon from 'react-native-vector-icons/Ionicons';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';

export default function EmployeeList({ navigation }: any) {
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state;

  const isFocused = useIsFocused();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const [purposes, setPurposes] = useState<string[]>([]);
  const [durations, setDurations] = useState<Record<string, string>>({});

  const [employees, setEmployees] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
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

  const getEmployees = async () => {
    const res = await getData('employees', auth.token!);
    setEmployees(res.data?.data || []);
    setAllEmployees(res.data?.data || []);
  };

  const getPurposes = async () => {
    const res = await getData('appointment/purposes', auth.token!);
    setPurposes(res.data || []);
  };

  const getDurations = async () => {
    const res = await getData('appointment/durations', auth.token!);
    setDurations(res.data || {});
  };

  const getDepartments = async () => {
    const res = await getData('departments', auth.token!);
    // setDepartments(res.data?.data || []);
  };

  const getDesignations = async () => {
    const res = await getData('designations', auth.token!);
    // setDesignations(res.data?.data || []);
  };

  const clearFields = () => {
    setPersonName('');
    setNoOfPerson('');
    setPersonId('');
    setMeetingDate(new Date());
    setMeetingTime(new Date());
    setMeetingDuration('');
    setPurpose('');
    setNote('');
    setError('');
    setMeetings([]);
  };

  const handleSubmit = async () => {
    if (meetings.length === 0) return Alert.alert('Error', 'No meeting info set');

    if (!noOfPerson || !purpose) return setError('Please fill required fields');

    const formData = {
      person_id: personId,
      number_of_person: noOfPerson,
      meeting_date: meetings.map(m => moment(m.meetingDate).format('YYYY-MM-DD')),
      meeting_time: meetings.map(m => moment(m.meetingTime).format('HH:mm')),
      meeting_duration: meetings.map(m => m.meetingDuration),
      purpose,
      note,
    };

    setShowModal(false);
    dispatch({ type: 'LOADING', payload: true });
    const res = await postData('appointment/make/multiple', formData, auth.token!);
    dispatch({ type: 'LOADING', payload: false });

    if (res.errorMessage) {
      setShowModal(true);
      return setError(`Failed! ${res.errorMessage}`);
    }

    ToastAndroid.show(res.message || 'Success', ToastAndroid.LONG);
    clearFields();
  };

  const searchEmployees = () => {
    Keyboard.dismiss();
    let filtered = [...allEmployees];

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
  };

  const addMeeting = () => {
    if (!meetingDuration) return;
    setMeetings(prev => [...prev, { meetingDate, meetingTime, meetingDuration }]);
  };

  const removeMeeting = (index: number) => {
    setMeetings(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    getEmployees();
    getPurposes();
    getDurations();
    getDepartments();
    getDesignations();
  }, [isFocused]);

  useEffect(() => {
    searchEmployees();
  }, [searchDepartment, searchDesignation]);

  return (
    <>
      <View style={styles.searchBar}>
        <Input
          style={{ flex: 1, marginVertical: 10 }}
          placeholder={language === 'bn' ? 'নাম দিয়ে সার্চ করুন' : 'Search with name'}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <Icon name="search-outline" size={30} color="green" onPress={searchEmployees} />
      </View>

      <View style={styles.filterRow}>
        <View style={{ width: '48%' }}>
          <Text style={style.formLebel}>{language === 'bn' ? 'বিভাগ' : 'Department'}:</Text>
          <Picker
            selectedValue={searchDepartment}
            style={styles.picker}
            onValueChange={setSearchDepartment}
          >
            <Picker.Item label={language === 'bn' ? 'সব বিভাগ' : 'All departments'} value="" />
            {/* {departments.map((d: any) => (
              <Picker.Item key={d.id} label={d.name} value={d.name} />
            ))} */}
          </Picker>
        </View>

        <View style={{ width: '48%' }}>
          <Text style={style.formLebel}>{language === 'bn' ? 'উপাধি' : 'Designation'}:</Text>
          <Picker
            selectedValue={searchDesignation}
            style={styles.picker}
            onValueChange={setSearchDesignation}
          >
            <Picker.Item label={language === 'bn' ? 'সব উপাধি' : 'All Designations'} value="" />
            {/* {designations.map((d: any) => (
              <Picker.Item key={d.id} label={d.name} value={d.name} />
            ))} */}
          </Picker>
        </View>
      </View>

      <ScrollView>
        {employees.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              setPersonId(item.id);
              setPersonName(item.name);
              setShowModal(true);
            }}
          >
            <View style={styles.leftColumn}>
              <Image
                style={styles.avatarSmall}
                source={item.image ? { uri: item.image } : sample_profile_avatar}
              />
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.designation}</Text>
              <Text>{item.department}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={showModal} animationType="slide">
        <AuthContainer>
          <TouchableOpacity onPress={() => { setShowModal(false); clearFields(); }}>
            <Icon name="chevron-down" size={30} color="red" />
          </TouchableOpacity>

          <Heading style={styles.title}>
            {language === 'bn' ? 'ভিজিটর অ্যাপয়েন্টমেন্ট ফর্ম' : 'VISITOR APPOINTMENT FORM'}
          </Heading>

          <Error error={error} />

          <ScrollView>
            <Text style={style.formLebel}>{language === 'bn' ? 'কর্মকর্তার নাম' : 'Employee Name'}:</Text>
            <Input style={styles.input} value={personName} editable={false} />

            <Text style={style.formLebel}>{language === 'bn' ? 'ব্যক্তির সংখ্যা' : 'No. of Person'}:</Text>
            <Input style={styles.input} value={noOfPerson} onChangeText={setNoOfPerson} />

            <Text style={style.formLebel}>{language === 'bn' ? 'সাক্ষাতের উদ্দেশ্য' : 'Meeting Purpose'}:</Text>
            <Picker selectedValue={purpose} style={styles.picker} onValueChange={setPurpose}>
              <Picker.Item label="Select meeting purpose" value="" />
              {purposes.map((p, i) => (
                <Picker.Item key={i} label={p} value={p} />
              ))}
            </Picker>

            <Text style={style.formLebel}>{language === 'bn' ? 'বিবরন (ঐচ্ছিক)' : 'Note (optional)'}:</Text>
            <Input style={styles.input} value={note} onChangeText={setNote} />

            <Text style={style.formLebel}>{language === 'bn' ? 'সাক্ষাতের তারিখ' : 'Meeting Date'}:</Text>
            <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
              <Input style={styles.input} value={moment(meetingDate).format('YYYY-MM-DD')} editable={false} />
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openDatePicker}
              date={meetingDate}
              onConfirm={d => { setOpenDatePicker(false); setMeetingDate(d); }}
              onCancel={() => setOpenDatePicker(false)}
            />

            <Text style={style.formLebel}>{language === 'bn' ? 'সাক্ষাতের সময়' : 'Meeting Time'}:</Text>
            <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
              <Input style={styles.input} value={moment(meetingTime).format('HH:mm')} editable={false} />
            </TouchableOpacity>
            <DatePicker
              modal
              mode="time"
              open={openTimePicker}
              date={meetingTime}
              onConfirm={t => { setOpenTimePicker(false); setMeetingTime(t); }}
              onCancel={() => setOpenTimePicker(false)}
            />

            <Text style={style.formLebel}>{language === 'bn' ? 'সাক্ষাতের সময়কাল' : 'Meeting Duration'}:</Text>
            <Picker selectedValue={meetingDuration} style={styles.picker} onValueChange={setMeetingDuration}>
              <Picker.Item label="Select meeting duration" value="" />
              {Object.entries(durations).map(([v, l]) => (
                <Picker.Item key={v} label={l} value={v} />
              ))}
            </Picker>

            <FilledButton
              title={language === 'bn' ? 'জমা দিন' : 'ADD MEETING'}
              style={styles.loginButton}
              onPress={addMeeting}
            />

            {meetings.map((m, i) => (
              <View key={i} style={styles.meetingItem}>
                <View>
                  <Text>Date: {moment(m.meetingDate).format('YYYY-MM-DD')}</Text>
                  <Text>Time: {moment(m.meetingTime).format('HH:mm')}</Text>
                  <Text>Duration: {m.meetingDuration}</Text>
                </View>
                <TouchableOpacity onPress={() => removeMeeting(i)}>
                  <Text style={{ color: 'red' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            <FilledButton
              title={language === 'bn' ? 'জমা দিন' : 'SUBMIT'}
              style={styles.loginButton}
              onPress={handleSubmit}
            />
          </ScrollView>
        </AuthContainer>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#FFF' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#FFF' },
  picker: { height: 50, backgroundColor: '#e8e8e8', borderRadius: 8, marginVertical: 10 },
  card: { margin: 10, padding: 10, backgroundColor: '#FFF', borderRadius: 8, flexDirection: 'row' },
  leftColumn: { width: '30%', borderRightWidth: 1, borderRightColor: 'green', alignItems: 'center' },
  avatarSmall: { width: 50, height: 50 },
  rightColumn: { flex: 1, marginLeft: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: 'green' },
  title: { marginVertical: 20, fontWeight: 'bold', fontSize: 20 },
  input: { marginVertical: 10 },
  loginButton: { marginVertical: 10 },
  meetingItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});