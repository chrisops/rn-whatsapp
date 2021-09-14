import { Entypo, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./styles";
import {
  API,
  Auth,
  graphqlOperation,
} from 'aws-amplify'

import { createMessage, updateChatRoom } from '../../src/graphql/mutations'

const InputBox = (props) => {

  const { chatRoomID } = props
  const [message, setMessage] = React.useState('')
  const [myUserId, setMyUserId] = React.useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser()
      setMyUserId(userInfo.attributes.sub)
    }
    fetchUser()
  },[])

  const onMicrophonePress = () => {
    console.warn('Microphone press')
  }

  const updateChatRoomLastMessage = async (messageId: String) => {
    try {
      await API.graphql(graphqlOperation(updateChatRoom, {input: {
        id: chatRoomID,
        lastMessageID: messageId
      }}))
    } catch(e) {
      console.log(e)
    }
  } 

  const onSendPress = async () => {

    try {
      if (message === "") {return}
      let localMsg = message
      setMessage("")
      const newMessageData = await API.graphql(graphqlOperation(createMessage, {input: {
        content: localMsg,
        userID: myUserId,
        chatRoomID
      }}))
      

      await updateChatRoomLastMessage(newMessageData.data.createMessage.id)

    } catch (e) {
      console.log(e)
    }
  }

  const onPress = () => {
    if (!message) {
      onMicrophonePress()
    } else {
      onSendPress()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FontAwesome5 name='laugh-beam' size={24} color='grey' />
        <TextInput 
          placeholder='Type a message...'
          numberOfLines={6} 
          multiline 
          style={styles.textInput} 
          value={message} 
          onChangeText={setMessage} />
        <Entypo name='attachment' size={24} color='grey' style={styles.icon}/>
        {!message && <Fontisto name='camera' size={24} color='grey' style={styles.icon}/> }
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
          {!message 
            ? <MaterialCommunityIcons name='microphone' size={28} color='white' /> 
            : <MaterialIcons name='send' size={28} color='white' /> 
          }
        </View>
      </TouchableOpacity>

    </View>
  )
}

export default InputBox