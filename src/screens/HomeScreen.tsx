import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { MSTContext } from '../schema/mobx/MobxContext';

// Mock data for dashboard cards
const mockVendors = [
  { id: '1', name: 'Acme Corp', service: 'Catering', location: 'NY', rating: 4.5 },
  { id: '2', name: 'Globex Inc', service: 'Security', location: 'CA', rating: 4.2 },
  { id: '3', name: 'Initech', service: 'IT', location: 'TX', rating: 4.8 },
  { id: '4', name: 'Umbrella', service: 'Cleaning', location: 'FL', rating: 4.0 },
];
const mockOptedIn = true; // Replace with MobX state if available
const mockPendingInvites = 2; // Replace with MobX state if available

const HomeScreen = observer(() => {
  const rootStore = MSTContext();
  const user = rootStore.UserStore.user;
  const teamStore = rootStore.TeamStore;
  const auditLogStore = rootStore.AuditLogStore;

  const recentLogs = auditLogStore.logs.slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome{user ? `, ${user.firstName}` : ''}!</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Role</Text>
          <Text style={styles.cardValue}>{teamStore.userRole}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Team Members</Text>
          <Text style={styles.cardValue}>{teamStore.members.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vendors</Text>
          <Text style={styles.cardValue}>{mockVendors.length}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Marketplace Opt-in</Text>
          <Text style={styles.cardValue}>{mockOptedIn ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Invites</Text>
          <Text style={styles.cardValue}>{mockPendingInvites}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {recentLogs.length === 0 ? (
            <Text style={styles.cardDesc}>No recent activity.</Text>
          ) : (
            recentLogs.map((item, idx) => (
              <Text style={styles.logItem} key={idx}>
                [{new Date(item.timestamp).toLocaleTimeString()}] {item.user}: {item.action}
              </Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#f8f9fa',
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 15,
    color: '#666',
  },
  logItem: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
});

export default HomeScreen;
