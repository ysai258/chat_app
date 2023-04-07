import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../../contexts/Auth';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from 'react-query';
import {GetConnectedUsers, GetUsers} from '../../apis/Users.api';
import {useNavigation} from '@react-navigation/native';
import {LOG_OUT, NO_IMG} from '../../constants/Constants';

const Home = () => {
  const {signOut, authData} = useAuth();

  const {data: usersData} = useQuery({
    queryKey: 'getUsers',
    queryFn: () => GetUsers({userId: authData?.userId}),
  });

  const {data: connectedUsersData} = useQuery({
    queryKey: 'getConnectedUsers',
    queryFn: () => GetConnectedUsers({userId: authData?.userId}),
  });

  const navigation = useNavigation();

  const ProfileCard = ({user}) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#021c4d',
          borderRadius: 24,
          borderWidth: 1,
          borderColor: 'white',
          margin: 10,
        }}>
        <Image
          source={{uri: user.img || NO_IMG}}
          style={{
            height: 125,
            width: 125,
            borderRadius: 100,
            marginVertical: 15,
          }}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            margin: 15,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 12,
          }}>
          <Text style={{fontSize: 18, marginTop: 30 ,color:"black"}}>{user.username}</Text>
          <Text style={{fontSize: 14, marginTop: 10, marginBottom: 30,color:"black"}}>
            {user.email}
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 25,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: 'grey',
            }}
            onPress={() => {
              navigation.navigate('Chat', {receiver: user});
            }}>
            <Text style={{color:"black"}}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (connectedUsersData) setUsers(connectedUsersData?.connectedUsers);
  }, [connectedUsersData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const numUsersToDisplay = 4;

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + numUsersToDisplay >= users.length;
  const flatListRef = useRef(null);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - numUsersToDisplay);
      flatListRef.current.scrollToIndex({
        index: currentIndex - numUsersToDisplay,
        animated: true,
      });
    }
  };

  const handleNextClick = () => {
    if (currentIndex + numUsersToDisplay < users.length) {
      setCurrentIndex(currentIndex + numUsersToDisplay);
      flatListRef.current.scrollToIndex({
        index: currentIndex + numUsersToDisplay,
        animated: true,
      });
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={{margin: 10}}
      onPress={() => navigation.navigate('Chat', {receiver: item})}>
      <Image
        source={{uri: item.img || NO_IMG}}
        style={{width: 60, height: 60, borderRadius: 30}}
      />
    </TouchableOpacity>
  );

  const getItemLayout = (data, index) => ({
    length: 60,
    offset: 60 * index,
    index,
  });

  return (
    <LinearGradient
      colors={['rgba(3,74,129,1)', 'rgba(118,11,11,1)', 'rgba(73,2,96,1)']}
      start={{x: 0.7, y: 0.3}}
      end={{x: 0.9, y: 0.8}}
      style={{flex: 1}}>
      <View style={{justifyContent: 'center'}}>
        <TouchableOpacity
          onPress={signOut}
          style={{alignSelf: 'flex-end', margin: 20}}>
          <Image
            source={{
              uri: LOG_OUT,
            }}
            style={{height: 50, width: 50, transform: [{rotate: '180deg'}]}}
          />
        </TouchableOpacity>
        {users?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              marginHorizontal: 20,
              borderRadius: 36,
            }}>
            <TouchableOpacity
              disabled={isPrevDisabled}
              onPress={handlePrevClick}
              style={[styles.button, isPrevDisabled && styles.disabledButton]}>
              <Text style={styles.buttonText}>{'<'}</Text>
            </TouchableOpacity>
            <FlatList
              ref={flatListRef}
              horizontal
              data={users}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              getItemLayout={getItemLayout}
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={0}
              windowSize={2}
              maxToRenderPerBatch={numUsersToDisplay}
              initialNumToRender={numUsersToDisplay}
              updateCellsBatchingPeriod={100}
            />
            <TouchableOpacity
              disabled={isNextDisabled}
              onPress={handleNextClick}
              style={[styles.button, isNextDisabled && styles.disabledButton]}>
              <Text style={styles.buttonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          horizontal
          data={usersData?.users}
          renderItem={({item}) => <ProfileCard user={item} />}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
    borderColor: 'grey',
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color:"black"
  },
});

export default Home;
