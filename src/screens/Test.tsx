import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Pagination from '../components/Pagination';

export default function Test() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://restapi.adequateshop.com/api/Tourist?page=${currentPage}`
      );
      const json = await response.json();
      setTotalPages(json.total_pages || 1);
      setData(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <View style={{ flex: 1 }}>
      {data.map((item, index) => (
        <View key={index}>
          <Text>
            {index + 1}. {item.tourist_name}
          </Text>
        </View>
      ))}

      <View>
        <Pagination
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </View>
    </View>
  );
}