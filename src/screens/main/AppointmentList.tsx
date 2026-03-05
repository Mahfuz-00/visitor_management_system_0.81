import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { DataContext } from '../../store/GlobalState';
import { postData } from '../../utils/fetchData';
import moment from 'moment';
import sample_profile_avatar from '../../assets/sample_profile_avatar.png';
import { useIsFocused } from '@react-navigation/native';
import Pagination from '../../components/Pagination';
import Icon from 'react-native-vector-icons/Ionicons';
import { ACTIONS } from '../../store/Actions';

export default function AppointmentList({ navigation }: any) {
  const { state, dispatch } = useContext(DataContext)!;
  const { auth, language } = state; // ✅ Destructured language
  const isFocused = useIsFocused();

  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef<ScrollView>(null);

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const getAppointmentList = async () => {
    dispatch({ type: ACTIONS.LOADING, payload: true });
    try {
      const res = await postData(`appointment/list?page=${currentPage}`, {}, auth.token!);
      if (res.data) {
        setTotalPages(res.data.last_page || 1);
        setAppointmentList(res.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: ACTIONS.LOADING, payload: false });
    scrollTop();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#9E9E9E';
      case 'Rejected': return '#FF5252';
      case 'Pending confirmation': return '#FF9800'; 
      default: return '#4CAF50';
    }
  };

  // ✅ Helper for Status Language
  const getStatusTranslation = (status: string) => {
    if (language === 'EN') return status;
    switch (status) {
      case 'Pending': return 'পেন্ডিং';
      case 'Rejected': return 'বাতিল';
      case 'Pending confirmation': return 'নিশ্চিতকরণের অপেক্ষায়';
      case 'Approved': return 'অনুমোদিত';
      default: return status;
    }
  };

  useEffect(() => {
    if (isFocused) getAppointmentList();
  }, [isFocused, currentPage]);

  // ✅ Handle "No Appointment" State
  if (!state.loading && appointmentList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="calendar-clear-outline" size={80} color="#DDD" />
        <Text style={{ marginTop: 10, color: '#999', fontSize: 16 }}>
          {language === 'EN' ? 'No Appointments Found' : 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      ref={scrollRef} 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30}}
    >
      {appointmentList.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AppointmentDetails', { appointmentDetails: item })}
        >
          <View style={styles.topRow}>
            <Image style={styles.avatar} source={sample_profile_avatar} />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.to.name}</Text>
              <Text style={styles.type}>{item.to.type}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bottomRow}>
            <View style={styles.statusWrapper}>
               <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
               <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                 {getStatusTranslation(item.status)}
               </Text>
            </View>

            <View style={styles.dateTimeWrapper}>
               <Icon name="calendar-outline" size={14} color="#D32F2F" />
               <Text style={styles.dateText}>
                 {moment(item.request.day, 'DD MMMM, YYYY').format('DD MMM')}
               </Text>
               <View style={styles.verticalSeparator} />
               <Icon name="time-outline" size={14} color="#666" />
               <Text style={styles.timeText}>
                 {moment(item.request.time, 'HH:mm').format('hh:mm A')}
               </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  card: {
    marginVertical: 8, marginHorizontal: 16, padding: 16,
    backgroundColor: '#FFF', borderRadius: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }, android: { elevation: 3 } }),
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0' },
  nameContainer: { marginLeft: 12, flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: '#2E7D32', lineHeight: 22 },
  type: { fontSize: 13, color: '#757575', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusWrapper: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  dateTimeWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 12, fontWeight: 'bold', color: '#D32F2F', marginLeft: 4 },
  verticalSeparator: { width: 1, height: 12, backgroundColor: '#DDD', marginHorizontal: 8 },
  timeText: { fontSize: 12, color: '#444', marginLeft: 4 },
  pagination: { marginTop: 10, paddingBottom: 20 },
});