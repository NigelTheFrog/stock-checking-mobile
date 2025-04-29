import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CredentialContext, BaseURL } from '../../Credentials';
import DocumentItemCsoList from './home/DocumentItemCsoList';
import DocumentItemCssList from './home/DocumentItemCssList';
import DocumentAvalanCsoList from './home/DocumentAvalanCssList';
import DocumentAvalanCssList from './home/DocumentAvalanCsoList';



const Tab = createMaterialTopTabNavigator();

export default function HomeScreenApproval() {
  const { storedCredentials, setStoredCredentials } = React.useContext(CredentialContext);

    return (
      <Tab.Navigator>
        <Tab.Screen name="Daftar NoDoc CSO Item" options={{tabBarLabelStyle: {fontSize: 10}}} component={DocumentItemCsoList} />
        <Tab.Screen name="Daftar NoDoc CSS Item" options={{tabBarLabelStyle: {fontSize: 10}}} component={DocumentItemCssList} />
        <Tab.Screen name="Daftar NoDoc CSO Avalan" options={{tabBarLabelStyle: {fontSize: 10}}} component={DocumentAvalanCsoList} />
        <Tab.Screen name="Daftar NoDoc CSS Avalan" options={{tabBarLabelStyle: {fontSize: 10}}} component={DocumentAvalanCssList} />
      </Tab.Navigator>
    )
  
}