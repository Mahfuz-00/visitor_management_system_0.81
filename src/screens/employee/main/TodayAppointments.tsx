import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { DataContext } from '../../../store/GlobalState';
import { getData } from '../../../utils/fetchData';
import moment from 'moment';
import sample_profile_avatar from '../../../assets/sample_profile_avatar.png';
import { useIsFocused } from '@react-navigation/native';
import Pagination from '../../../components/Pagination';

export default function TodayAppointments({ navigation }: any) {
  const { state, dispatch } = useContext(DataContext)!;
  const { auth } = state;

  const isFocused = useIsFocused();

  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const scrollRef = useRef<ScrollView>(null);

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const getTodayAppointments = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData('employee/appointment/today', auth.token!);
    setTotalPages(res.data.last_page || 1);
    setAppointmentList(res.data.data || []);
    dispatch({ type: 'LOADING', payload: false });
    scrollTop();
  };

  const statusBG = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'grey';
      case 'Rejected':
        return 'red';
      case 'Pending confirmation':
        return '#FFF';
      default:
        return 'green';
    }
  };

  useEffect(() => {
    if (isFocused) {
      getTodayAppointments();
    }
  }, [isFocused]);

  if (appointmentList.length === 0) {
    return (
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.emptyContainer}
      >
        <Text>No Appointment Today</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView ref={scrollRef}>
      {appointmentList.map((item: any, index: number) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() =>
            navigation.navigate('EmployeeAppointmentDetails', {
              appointmentDetails: item,
            })
          }
        >
          <View style={styles.leftColumn}>
            <Text style={[styles.statusBadge, { backgroundColor: statusBG(item.status) }]}>
              {item.status !== 'Pending confirmation' ? item.status : ''}
            </Text>
            <Text style={styles.day}>{moment(item.request.day).format('DD')}</Text>
            <Text style={styles.month}>{moment(item.request.day).format('MMM').toUpperCase()}</Text>
            <Text style={styles.time}>
              {moment(item.request.time, 'HH:mm').format('HH:mm A')}
            </Text>
          </View>

          <View style={styles.rightColumn}>
            <Image style={styles.avatar} source={sample_profile_avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.from.name}</Text>
              <Text style={styles.phone}>{item.from.phone}</Text>
              <Text style={styles.type}>{item.from.type}</Text>
              {item.status === 'Pending confirmation' && (
                <Text style={styles.pending}>{item.status}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    flexDirection: 'row',
  },
  leftColumn: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    color: '#FFF',
    borderRadius: 6,
    fontSize: 14,
  },
  day: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'red',
  },
  month: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'red',
  },
  time: { fontSize: 16 },
  rightColumn: {
    width: '70%',
    marginLeft: 15,
    flexDirection: 'row',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  phone: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  type: { fontSize: 14, marginTop: 10 },
  pending: {
    fontSize: 14,
    marginTop: 5,
    color: 'red',
  },
  pagination: {
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});