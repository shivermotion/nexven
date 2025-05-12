import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const mockVendors = [
  { id: '1', name: 'Acme Corp', contact: 'acme@email.com' },
  { id: '2', name: 'Globex Inc', contact: 'globex@email.com' },
  { id: '3', name: 'Initech', contact: 'initech@email.com' },
];

const VendorsScreen = () => {
  const navigation: any = useNavigation();
  const [vendors] = useState(mockVendors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendors</Text>
      <FlatList
        data={vendors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.vendorCard}
            onPress={() => navigation.navigate('VendorDetail' as never, { vendor: item } as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.vendorName}>{item.name}</Text>
            <Text style={styles.vendorContact}>{item.contact}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('VendorNew' as never)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
    letterSpacing: 0.2,
  },
  list: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginBottom: 18,
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#F0F1F3',
  },
  vendorName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  vendorContact: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    fontWeight: '400',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default VendorsScreen;
