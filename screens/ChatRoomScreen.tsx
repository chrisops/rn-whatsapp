import React, { useEffect, useState } from 'react'
import { FlatList, Text, ImageBackground, ActivityIndicatorBase, ActivityIndicator, View } from 'react-native'

import { useRoute } from '@react-navigation/native'
import chatRoomData from '../data/Chats'
import ChatMessage from '../components/ChatMessage'
import BG from '../assets/images/BG.png'
import InputBox from '../components/InputBox'
import LottieView from 'lottie-react-native'
import {
  API,
  Auth,
  graphqlOperation
} from 'aws-amplify'

import { messagesByChatRoom } from '../src/graphql/queries'
import { onCreateMessage } from '../src/graphql/subscriptions'


const ChatRoomScreen = () => {

  const [messages, setMessages] = useState([])
  const [myId, setMyId] = useState(null)
  const [loading, setLoading] = useState(true)

  const route = useRoute()

  const fetchMessages = async () => {
    try {
      const messagesData = await API.graphql(
        graphqlOperation(messagesByChatRoom, {
          chatRoomID: route.params.id,
          sortDirection: "DESC",
        })
      )
      setMessages(messagesData.data.messagesByChatRoom.items)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser()
      setMyId(userInfo.attributes.sub)
    }
    getMyId()
  }, [])

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateMessage)).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage

        if (newMessage.chatRoomID !== route.params.id) {
          console.log("message is in another room")
          return
        }

        fetchMessages()

        // setMessages([newMessage, ...messages])
      }
    })
    return () => subscription.unsubscribe()
  }, [])



  return (
    <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
      { (loading) ? <View style={{width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#0C6157"/>
        </View>
      : 
      <>
        <FlatList
          data={messages}
          renderItem={({ item }) => <ChatMessage message={item} myId={myId} />}
          inverted
        />
        <InputBox chatRoomID={route.params.id}/>
      </>
        }
    </ImageBackground>
  )
}

export default ChatRoomScreen