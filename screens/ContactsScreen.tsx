import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { View } from '../components/Themed';

import chatRooms from '../data/ChatRooms';
import NewMessageButton from '../components/NewMessageButton';
import ContactListItem from '../components/ContactListItem';
import { useEffect, useState } from 'react';
import { listUsers } from '../src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default function ContactsScreen() {

  const [users, setUsers] = useState([])

  useEffect(() => {
   const fetchUsers = async () => {
     try {
      const usersData = await API.graphql(graphqlOperation(listUsers))
      setUsers(usersData.data.listUsers.items)
     } catch (e) {
      console.log(e)
     }
   }
   fetchUsers() 
  }, [])

  return (
    <View style={styles.container}>
      <FlatList 
        data={users} 
        renderItem={({ item }) => <ContactListItem user={item}/>}
        keyExtractor={(item) => item.id}
        style={{width: '100%'}}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
