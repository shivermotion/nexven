import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { MSTContext } from '../schema/mobx/MobxContext';

const roles = ['admin', 'manager', 'viewer'] as const;

const mockMembers = [
  { id: 1, email: 'alice@email.com', firstName: 'Alice', lastName: 'Smith' },
  { id: 2, email: 'bob@email.com', firstName: 'Bob', lastName: 'Jones' },
  { id: 3, email: 'carol@email.com', firstName: 'Carol', lastName: 'Lee' },
];

const TeamScreen = observer(() => {
  const rootStore = MSTContext();
  const teamStore = rootStore.TeamStore;
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  // Add mock members on first render if empty
  useEffect(() => {
    if (teamStore.members.length === 0) {
      mockMembers.forEach(member => teamStore.addMember(member));
      // Set roles for demo
      teamStore.setMemberRole(1, 'admin');
      teamStore.setMemberRole(2, 'manager');
      teamStore.setMemberRole(3, 'viewer');
    }
  }, [teamStore]);

  const handleAddMember = () => {
    if (!newMemberEmail) return;
    // Mock user id
    const newId = Math.floor(Math.random() * 100000);
    teamStore.addMember({
      id: newId,
      email: newMemberEmail,
      firstName: newMemberName,
      lastName: '',
    });
    setAddModalVisible(false);
    setNewMemberEmail('');
    setNewMemberName('');
  };

  const handleRemoveMember = (id: number) => {
    teamStore.removeMember(id);
  };

  const handleRoleChange = (id: number, role: (typeof roles)[number]) => {
    teamStore.setMemberRole(id, role);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Members</Text>
      <FlatList
        data={teamStore.members.slice()}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{item.firstName || item.email}</Text>
              <Text style={styles.memberEmail}>{item.email}</Text>
            </View>
            <View style={styles.roleRow}>
              {roles.map(role => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleChip,
                    teamStore.getMemberRole(item.id) === role && styles.roleChipSelected,
                  ]}
                  disabled={!teamStore.hasPermission('manage')}
                  onPress={() => handleRoleChange(item.id, role)}
                >
                  <Text
                    style={
                      teamStore.getMemberRole(item.id) === role
                        ? styles.roleTextSelected
                        : styles.roleText
                    }
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {teamStore.hasPermission('manage') && (
              <TouchableOpacity onPress={() => handleRemoveMember(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.text}>No team members yet.</Text>}
      />
      {teamStore.hasPermission('manage') && (
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>
      )}
      {/* Add Member Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Team Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMember}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
    letterSpacing: 0.2,
  },
  text: {
    fontSize: 16,
    color: '#888',
    marginTop: 32,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#F0F1F3',
  },
  memberName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
  roleRow: {
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  roleChip: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 4,
  },
  roleChipSelected: {
    backgroundColor: '#2563eb',
  },
  roleText: {
    color: '#333',
    fontSize: 14,
  },
  roleTextSelected: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeText: {
    color: '#d00',
    fontSize: 14,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 20,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 32,
    right: 32,
    shadowColor: '#2563eb',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  input: {
    width: '100%',
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
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

export default TeamScreen;
