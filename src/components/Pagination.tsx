import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface Props {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View>
      <View style={styles.row}>
        <ScrollView horizontal>
          {pages.map(page => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageButton,
                { backgroundColor: currentPage === page ? 'green' : 'grey' },
              ]}
              onPress={() => setCurrentPage(page)}
            >
              <Text style={styles.pageText}>{page}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  pageButton: {
    marginRight: 10,
    padding: 10,
    height: 40,
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  pageText: {
    color: 'white',
  },
});