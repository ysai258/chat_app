import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import {useAuth} from '../../contexts/Auth';
import LinearGradient from 'react-native-linear-gradient';

const Login = () => {
  const {signIn,authData} = useAuth();

  return (
    <LinearGradient
      colors={['rgba(3,74,129,1)', 'rgba(118,11,11,1)', 'rgba(73,2,96,1)']}
      start={{x: 0.7, y: 0.3}}
      end={{x: 0.9, y: 0.8}}
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={signIn}
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../../assets/googleIcon.png')}
          style={{height: 20, width: 20, margin: 10}}></Image>
        <Text style={{color: 'grey', fontWeight: '600', fontSize: 16}}>
          Signup with Google
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Login;
