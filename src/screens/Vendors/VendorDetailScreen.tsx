import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

// ---------- TYPES ----------
interface Vendor {
  id: string;
  name: string;
  contact?: string;
  rating?: number;
}

type VendorStackParamList = {
  VendorDetail: { vendor: Vendor };
  VendorEdit: { vendor: Vendor };
};

type VendorDetailRouteProp = RouteProp<VendorStackParamList, 'VendorDetail'>;
type VendorDetailNavigationProp = NavigationProp<VendorStackParamList, 'VendorDetail'>;

// ---------- MOCK DATA ----------
const initialReviews = [
  { id: '1', user: 'Alice', rating: 5, comment: 'Great service and communication.' },
  { id: '2', user: 'Bob', rating: 4, comment: 'Very professional.' },
  { id: '3', user: 'Carol', rating: 5, comment: 'Highly recommended!' },
];

// ---------- COMPONENT ----------
const VendorDetailScreen = () => {
  const navigation = useNavigation<VendorDetailNavigationProp>();
  const route = useRoute<VendorDetailRouteProp>();
  const vendor = route.params?.vendor;

  const [reviews, setReviews] = useState(initialReviews);
  const [reviewModalVisible, setModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!vendor) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vendor not found</Text>
      </View>
    );
  }

  // ----- handlers -----
  const handleEdit = () => navigation.navigate('VendorEdit', { vendor });
  const handleDelete = () =>
    Alert.alert('Delete Vendor', 'Are you sure you want to delete this vendor?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
    ]);

  const handleSubmitReview = () => {
    setReviews([
      ...reviews,
      {
        id: (reviews.length + 1).toString(),
        user: 'You',
        rating: reviewRating,
        comment: reviewComment,
      },
    ]);
    setModalVisible(false);
    setReviewRating(5);
    setReviewComment('');
  };

  const avgRating =
    vendor.rating ||
    (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0);

  // ---------- RENDER ----------
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ------ INFO CARD ------ */}
        <View style={styles.vendorCard}>
          <Text style={styles.title}>{vendor.name}</Text>

          {vendor.contact && (
            <>
              <Text style={styles.label}>Contact:</Text>
              <Text style={styles.value}>{vendor.contact}</Text>
            </>
          )}

          <Text style={styles.rating}>
            Rating: {avgRating.toFixed(1)} ({reviews.length} reviews)
          </Text>

          <TouchableOpacity style={styles.ctaButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.ctaText}>Add Review</Text>
          </TouchableOpacity>
        </View>

        {/* ------ REVIEWS ------ */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        <FlatList
          data={reviews}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewUser}>
                {item.user} <Text style={styles.reviewRating}>({item.rating}★)</Text>
              </Text>
              <Text style={styles.reviewComment}>{item.comment}</Text>
            </View>
          )}
          contentContainerStyle={styles.reviewsList}
          ListEmptyComponent={<Text style={styles.emptyText}>No reviews yet.</Text>}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* ------ ACTION ROW ------ */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* ------ REVIEW MODAL ------ */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Review</Text>

            <Text style={styles.modalLabel}>Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Text style={reviewRating >= star ? styles.starSelected : styles.star}>★</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Comment</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your review..."
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmitReview}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ---------- STYLES ----------
const CARD_WIDTH = 320;
const BLUE = '#2563eb';
const GRAY_BG = '#F6F7F9';

const styles = StyleSheet.create({
  // page container
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: GRAY_BG,
    paddingTop: 32,
    justifyContent: 'space-between',
  },

  scrollContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },

  // headline
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    letterSpacing: 0.2,
  },

  // section label
  label: { fontSize: 16, color: '#666', marginTop: 8 },

  value: { fontSize: 18, color: '#333', marginBottom: 8 },

  // rating text
  rating: { fontSize: 16, color: BLUE, marginBottom: 12 },

  // white card that mirrors VendorsScreen vendorCard
  vendorCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#F0F1F3',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  // CTA button (same blue as FAB)
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: BLUE,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 4,
  },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  // section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginLeft: 28,
    marginBottom: 8,
  },

  // review list
  reviewsList: { paddingBottom: 16 },

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#F0F1F3',
  },
  reviewUser: { fontWeight: '600', color: '#222', marginBottom: 2 },
  reviewRating: { color: BLUE, fontWeight: 'bold' },
  reviewComment: { color: '#444', fontSize: 15 },

  // empty state
  emptyText: { color: '#888', fontSize: 16, marginTop: 16 },

  // edit / delete button row
  buttonRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },

  editButton: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // ---------- modal ----------
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 16 },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },

  ratingRow: { flexDirection: 'row', marginBottom: 12 },
  star: { fontSize: 28, color: '#ccc', marginHorizontal: 2 },
  starSelected: { fontSize: 28, color: '#FFD700', marginHorizontal: 2 },

  modalInput: {
    width: CARD_WIDTH - 60,
    minHeight: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#F6F7F9',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtonRow: { flexDirection: 'row', marginTop: 8 },
  saveButton: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 16,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default VendorDetailScreen;
