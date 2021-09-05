import moment from 'moment'
import React from 'react'
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native'
import { ChatRoom, User } from '../../types'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createChatRoom, createChatRoomUser } from '../../src/graphql/mutations'

export type ContactListItemProps = {
  user: User;
}

const ContactListItem = (props: ContactListItemProps) => {
  const {user} = props
  const navigation = useNavigation()
  const onClick = async () => {
    // Navigate to chatroom with this user
    try {
      // 1 create a new chatroom
      const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {} }))
      if (!newChatRoomData.data) {
        console.log("Failed to create chat room")
        return
      }
      
      const newChatRoom = newChatRoomData.data.createChatRoom
      // 2 add user to the chatroom reference
      const newUserChatRoom = await API.graphql(graphqlOperation(createChatRoomUser, {
        input: {
          userID: user.id,
          chatRoomID: newChatRoom.id
        }
      }))
      // 3 add authenticated user to the chatroom
      const userInfo = await Auth.currentAuthenticatedUser()
      await API.graphql(graphqlOperation(createChatRoomUser, {
        input: {
          userID: userInfo.attributes.sub,
          chatRoomID: newChatRoom.id,
        }
      }))

      navigation.navigate('ChatRoom', {
        id: newChatRoom.id,
        name: 'hardcoded name',
      })

    } catch (e) {
      console.log(e)
    }
  }
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar} />
          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.lastMessage} numberOfLines={1}>{user.status}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ContactListItem