import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { DataContext } from '../../../store/GlobalState';
import { getData } from '../../../utils/fetchData';
import moment from 'moment';
import sample_profile_avatar from '../../../assets/sample_profile_avatar.png';
import { useIsFocused } from '@react-navigation/native';
import Pagination from '../../../components/Pagination';

export default function AllAppointments({ navigation }: any) {
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

  const getAllAppointments = async () => {
    dispatch({ type: 'LOADING', payload: true });
    const res = await getData(`employee/appointment/all?page=${currentPage}`, auth.token!);
    setTotalPages(res.data.last_page);
    setAppointmentList(res.data.data);
    dispatch({ type: 'LOADING', payload: false });
    scrollTop();
  };

  const statusBG = (status: string) => {
    switch (status) {
      case 'Pending': return 'grey';
      case 'Rejected': return 'red';
      case 'Pending confirmation': return '#FFF';
      default: return 'green';
    }
  };

  useEffect(() => {
    if (isFocused) getAllAppointments();
  }, [isFocused, currentPage]);

  return (
    <ScrollView ref={scrollRef}>
      {appointmentList.map((item: any, index: number) => (
        <TouchableOpacity
          key={index}
          style={{ marginVertical: 10, padding: 10, marginHorizontal: 10, backgroundColor: '#FFF', borderRadius: 8, flexDirection: 'row' }}
          onPress={() => navigation.navigate('EmployeeAppointmentDetails', { appointmentDetails: item })}
        >
          <View style={{ width: '30%', borderRightWidth: 1, borderRightColor: 'green', justifyContent: 'center', alignItems: 'center', paddingRight: 5 }}>
            <Text style={{ backgroundColor: statusBG(item.status), paddingHorizontal: 8, color: '#FFF', borderRadius: 6, fontSize: 14 }}>
              {item.status !== 'Pending confirmation' ? item.status : ''}
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'red' }}>{moment(item.request.day).format('DD')}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'red' }}>{moment(item.request.day).format('MMM').toUpperCase()}</Text>
            <Text style={{ fontSize: 16 }}>{moment(item.request.time, 'HH:mm').format('HH:mm A')}</Text>
          </View>

          <View style={{ width: '70%', marginLeft: 15, flexDirection: 'row' }}>
            <View style={{ width: 50, height: 50 }}>
              <Image style={{ height: '100%', width: '100%' }} source={sample_profile_avatar} />
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>{item.from.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'red' }}>{item.from.phone}</Text>
              <Text style={{ fontSize: 14, marginTop: 10 }}>{item.from.type}</Text>
              <Text style={{ fontSize: 14, marginTop: 5, color: 'red' }}>
                {item.status === 'Pending confirmation' ? item.status : ''}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {totalPages > 1 && (
        <View style={{ marginBottom: 10 }}>
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </View>
      )}
    </ScrollView>
  );
}