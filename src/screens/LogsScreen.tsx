import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { observer } from 'mobx-react-lite';
import { MSTContext } from '../schema/mobx/MobxContext';

const mockLogs = [
  {
    user: 'Alice',
    action: 'Added vendor',
    details: 'Acme Corp',
    timestamp: Date.now() - 1000 * 60 * 60,
  },
  {
    user: 'Bob',
    action: 'Changed role',
    details: 'Carol to manager',
    timestamp: Date.now() - 1000 * 60 * 30,
  },
  { user: 'Carol', action: 'Logged in', details: '', timestamp: Date.now() - 1000 * 60 * 5 },
];

const LogsScreen = observer(() => {
  const rootStore = MSTContext();
  const auditLogStore = rootStore.AuditLogStore;
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Add mock logs on first render if empty
  useEffect(() => {
    if (auditLogStore.logs.length === 0) {
      mockLogs.forEach(log => auditLogStore.addLog(log));
    }
  }, [auditLogStore]);

  // Get unique action types
  const types = ['All', ...Array.from(new Set((auditLogStore?.logs || []).map(l => l.action)))];

  const filteredLogs = (auditLogStore?.logs || []).filter(log => {
    const matchesType = filterType === 'All' || log.action === filterType;
    const matchesDate = !filterDate || new Date(log.timestamp).toLocaleDateString() === filterDate;
    return matchesType && matchesDate;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audit Logs</Text>
      {/* Filter Row */}
      <View style={styles.filterRow}>
        {types.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.filterChip, filterType === type && styles.filterChipSelected]}
            onPress={() => setFilterType(type)}
          >
            <Text style={filterType === type ? styles.filterTextSelected : styles.filterText}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={filterDate}
          onChangeText={setFilterDate}
        />
      </View>
      <FlatList
        data={filteredLogs}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.logItem} onPress={() => setSelectedLog(item)}>
            <Text style={styles.logText}>
              [{new Date(item.timestamp).toLocaleString()}] {item.user} - {item.action}
            </Text>
            {item.details ? <Text style={styles.details}>{item.details}</Text> : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.text}>No logs yet.</Text>}
      />
      {/* Log Detail Modal */}
      <Modal
        visible={!!selectedLog}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedLog(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Details</Text>
            {selectedLog && (
              <>
                <Text style={styles.modalLabel}>User</Text>
                <Text style={styles.modalValue}>{selectedLog.user}</Text>
                <Text style={styles.modalLabel}>Action</Text>
                <Text style={styles.modalValue}>{selectedLog.action}</Text>
                <Text style={styles.modalLabel}>Timestamp</Text>
                <Text style={styles.modalValue}>
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Text>
                {selectedLog.details && (
                  <>
                    <Text style={styles.modalLabel}>Details</Text>
                    <Text style={styles.modalValue}>{selectedLog.details}</Text>
                  </>
                )}
              </>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedLog(null)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
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
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#333',
    fontSize: 15,
  },
  filterTextSelected: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  dateInput: {
    width: 120,
    height: 36,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginTop: 32,
  },
  logItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: 340,
  },
  logText: {
    fontSize: 16,
    fontWeight: '500',
  },
  details: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
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
    maxWidth: 400,
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
    marginTop: 8,
  },
  modalValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LogsScreen;
