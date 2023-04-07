import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../contexts/Auth';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useMutation, useQuery, useQueryClient} from 'react-query';
import {GetMessages, SendMessage} from '../../apis/Chat.api';
import {LEFT_ARROW, NO_IMG, SEND} from '../../constants/Constants';

const Chat = ({route}) => {
  const {receiver} = route?.params;
  const {authData} = useAuth();
  const {data: messagesData} = useQuery({
    queryKey: 'getMessages',
    queryFn: () =>
      GetMessages({sender: authData?.userId, receiver: receiver?._id}),
  });
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: SendMessage,
    onSuccess(data, variables, context) {
      setInputMsg('');
      queryClient.invalidateQueries('getMessages');
    },
  });

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (messagesData) setMessages(messagesData?.messages);
  }, [messagesData]);

  const navigation = useNavigation();
  const scrollViewRef = useRef();
  const [inputMsg, setInputMsg] = useState('');

  const sendMsg = () => {
    sendMessage.mutate({
      sender: authData?.userId,
      receiver: receiver._id,
      message: inputMsg,
    });
  };
  return (
    <LinearGradient
      colors={['rgba(73,2,96,1)', 'rgba(118,11,11,1)', 'rgba(3,74,129,1)']}
      start={{x: 0.9, y: 1.1}}
      end={{x: 1.6, y: 1}}
      style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: LEFT_ARROW,
              }}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#021c3b',
            marginTop: 50,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <View
            style={{
              position: 'relative',
              top: -50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: receiver.img || NO_IMG}}
              style={{width: 80, height: 80, borderRadius: 40}}
            />
          </View>

          <View style={{flex: 3, paddingHorizontal: 20}}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
              onLayout={() =>
                scrollViewRef.current.scrollToEnd({animated: true})
              }>
              {messages.map((msg, index) => {
                const isSenderMsg = authData?.userId === msg.sender;
                if (isSenderMsg) {
                  return (
                    <View
                      key={index}
                      style={{alignSelf: 'flex-end', marginVertical: 5}}>
                      <Text
                        style={{
                          backgroundColor: '#e8cd9e',
                          padding: 10,
                          borderRadius: 15,
                          borderBottomRightRadius: 0,
                          color: 'black',
                        }}>
                        {msg.message}
                      </Text>
                    </View>
                  );
                }
                return (
                  <View
                    key={index}
                    style={{alignSelf: 'flex-start', marginVertical: 5}}>
                    <Text
                      style={{
                        backgroundColor: '#969593',
                        padding: 10,
                        borderRadius: 15,
                        borderBottomLeftRadius: 0,
                        color: 'white',
                      }}>
                      {msg.message}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              paddingVertical: 20,
              paddingBottom: 30,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <TextInput
              value={inputMsg}
              onChangeText={text => setInputMsg(text)}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 24,
                backgroundColor: 'white',
                color:"black"
              }}
              placeholder="Type your message here"
            />
            <TouchableOpacity
              style={{
                marginLeft: 5,
                backgroundColor: 'white',
                borderRadius: 50,
                padding: 6,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={sendMsg}>
              <Image
                source={{
                  uri: SEND,
                }}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Chat;
