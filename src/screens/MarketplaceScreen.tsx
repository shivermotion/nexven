import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const mockVendors = [
  { id: '1', name: 'Acme Corp', service: 'Catering', location: 'NY', rating: 4.5 },
  { id: '2', name: 'Globex Inc', service: 'Security', location: 'CA', rating: 4.2 },
  { id: '3', name: 'Initech', service: 'IT', location: 'TX', rating: 4.8 },
  { id: '4', name: 'Umbrella', service: 'Cleaning', location: 'FL', rating: 4.0 },
];

const MarketplaceScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteVendor, setInviteVendor] = useState<any>(null);
  const [projectDesc, setProjectDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleInvite = (vendor: (typeof mockVendors)[0]) => {
    setInviteVendor(vendor);
    setInviteModalVisible(true);
  };

  const handleSubmitInvite = () => {
    setInviteModalVisible(false);
    setProjectDesc('');
    setDeadline('');
    setBudget('');
    Alert.alert('Invite Sent', `Your invite to ${inviteVendor?.name} was sent!`);
  };

  const handleVendorPress = (vendor: (typeof mockVendors)[0]) => {
    navigation.navigate('VendorDetailScreen' as never, { vendor } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <TextInput
        style={styles.search}
        placeholder="Search vendors..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#aaa"
      />
      <FlatList
        data={filteredVendors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.vendorCard}
            onPress={() => handleVendorPress(item)}
            activeOpacity={0.8}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <View>
                <Text style={styles.vendorName}>{item.name}</Text>
                <Text style={styles.vendorMeta}>
                  {item.service} • {item.location}
                </Text>
                <Text style={styles.vendorRating}>Rating: {item.rating}</Text>
              </View>
              <TouchableOpacity style={styles.inviteIconButton} onPress={() => handleInvite(item)}>
                <Ionicons name="mail-outline" size={22} color="#2563eb" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No vendors found.</Text>}
      />
      {/* Invite to Bid Modal */}
      <Modal
        visible={inviteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite to Bid</Text>
            <Text style={styles.modalLabel}>Vendor</Text>
            <Text style={styles.modalValue}>{inviteVendor?.name}</Text>
            <Text style={styles.modalLabel}>Project Description</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Describe your project..."
              value={projectDesc}
              onChangeText={setProjectDesc}
              multiline
            />
            <Text style={styles.modalLabel}>Deadline</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 2024-08-01"
              value={deadline}
              onChangeText={setDeadline}
            />
            <Text style={styles.modalLabel}>Budget</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="$1000"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmitInvite}>
                <Text style={styles.buttonText}>Send Invite</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setInviteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  search: {
    width: 320,
    height: 42,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 18,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#222',
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
  vendorMeta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
    fontWeight: '400',
  },
  vendorRating: {
    fontSize: 13,
    color: '#2563eb',
    marginBottom: 0,
    fontWeight: '500',
  },
  inviteIconButton: {
    backgroundColor: '#F0F4FF',
    borderRadius: 16,
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  modalInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MarketplaceScreen;
