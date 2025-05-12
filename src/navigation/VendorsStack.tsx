import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VendorsScreen from '../screens/Vendors/VendorsScreen';
import VendorDetailScreen from '../screens/Vendors/VendorDetailScreen';
import VendorEditScreen from '../screens/Vendors/VendorEditScreen';
import VendorNewScreen from '../screens/Vendors/VendorNewScreen';

const Stack = createNativeStackNavigator();

const VendorsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="VendorsList" component={VendorsScreen} options={{ title: 'Vendors' }} />
    <Stack.Screen
      name="VendorDetail"
      component={VendorDetailScreen}
      options={{ title: 'Vendor Details' }}
    />
    <Stack.Screen
      name="VendorEdit"
      component={VendorEditScreen}
      options={{ title: 'Edit Vendor' }}
    />
    <Stack.Screen name="VendorNew" component={VendorNewScreen} options={{ title: 'New Vendor' }} />
  </Stack.Navigator>
);

export default VendorsStack;
