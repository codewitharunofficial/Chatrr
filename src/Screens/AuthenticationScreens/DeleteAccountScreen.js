import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAccountScreen = () => {
    const route = useRoute();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const {name, id} = route.params.params;
    const [request, setRequest] = useState(false);
    const navigation = useNavigation();
    const handlePress = async () => {
        if(!email){
            return alert("Please Enter You Email ID");
        }
        Alert.alert('Warning', 'The Process Cannot Be Reversed! Do You Really Want To Proceed?', [
            {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/request-delete-account/${id}`, {email: email});
                    if(data?.success){
                        Toast.show(data.message);
                        setRequest(true);
                        AsyncStorage.clear();
                    }else{
                        Toast.show(data.message);
                        setRequest(false);
                    }
                    } catch (error) {
                        Toast.show(error.message);
                        
                    }
                }
            }
        ])
    };

    const deleteAccount = async () => {
        try {
            const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/delete-account/${id}`, {otp: otp, email: email});
            if(data?.success){
                Toast.show(data?.message, 3000);
                navigation.navigate("Login");
            } else {
                Toast.show(data?.message, 3000);
            }
        } catch (error) {
            console.log(error);
            Toast.show(error.message, 2000);
        }
    }
    
  return (
      <ScrollView automaticallyAdjustKeyboardInsets={true} scrollEnabled={true} contentContainerStyle={{width: '100%', height: '100%'}} >
    <View style={{width: '100%', height: '100%', flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 20, gap: 10}} >
        <Entypo name='warning' size={20} color={'red'} style={{marginLeft: 10}} />
      <Text style={{fontSize: 16, color: 'red', alignSelf: 'center',}} >Dear {name}, </Text>
      <Text style={{fontSize: 14, color: 'red', marginHorizontal: 10}} >Please Understand that if you delete this account:</Text>
      <View style={{width: '90%', alignSelf: 'center', flexDirection: 'row'}} >
         <Entypo name='dot-single' size={16} color={'black'} />
         <Text style={{fontWeight: 'bold'}} >The Account Will Be Deleted From Chatrr Database And All The Other Deivces You Logged In Or You Currently are.</Text>
      </View>
      <View style={{width: '90%', alignSelf: 'center', flexDirection: 'row'}} >
         <Entypo name='dot-single' size={16} color={'black'} />
         <Text style={{fontWeight: 'bold'}} >All Of Your Data & Messages & Chats Will Be Deleted Permanently</Text>
      </View>
      <View style={{width: '90%', alignSelf: 'center', flexDirection: 'row'}} >
         <Entypo name='dot-single' size={16} color={'black'} />
         <Text style={{fontWeight: 'bold'}} >The Process Is Irreversable And Couldn't be Stopped Once Confirmed</Text>
      </View>
      {
        request === false ? (
            <View style={{width: '100%', padding: 10, alignSelf: 'center', marginTop: 20, alignItems: 'center'}} >
        <Text style={{color: 'green', fontWeight: '500', textDecorationLine: 'underline', alignSelf: 'flex-start'}} >Enter Your Email Address To Get An OTP For Confirmation:</Text>
        <View style={{width: '90%', marginTop: 100, alignItems: 'center'}} >
            <TextInput onChangeText={setEmail} style={{padding: 10, borderWidth: 0.5, borderRadius: 20, width: '100%', marginHorizontal: 10,}} editable={true} placeholder='Enter Your Email' />
        </View>
        <TouchableOpacity onPress={handlePress} style={{backgroundColor: 'red', padding: 10, marginTop: 20, borderRadius: 20}} >
            <Text style={{color: 'white'}} >Request Delete</Text>
        </TouchableOpacity>
      </View>
        ) : (
            <View style={{width: '100%', padding: 10, alignSelf: 'center', marginTop: 20, alignItems: 'center'}} >
        <Text style={{color: 'green', fontWeight: '500', textDecorationLine: 'underline', alignSelf: 'flex-start'}} >Enter The OTP Sent To Your Email Address To Confirm:</Text>
        <View style={{width: '90%', marginTop: 100, alignItems: 'center'}} >
            <TextInput onChangeText={setEmail} style={{padding: 10, borderWidth: 0.5, borderRadius: 20, width: '100%', marginHorizontal: 10,}} editable={true} placeholder='Enter Your Email' />
        </View>
        <View style={{width: '90%', marginTop: 20, alignItems: 'center'}} >
            <TextInput onChangeText={setOtp} style={{padding: 10, borderWidth: 0.5, borderRadius: 20, width: '100%', marginHorizontal: 10,}} editable={true} placeholder='Enter OTP' />
        </View>
        <TouchableOpacity onPress={deleteAccount} style={{backgroundColor: 'red', padding: 10, marginTop: 20, borderRadius: 20}} >
            <Text style={{color: 'white'}} >Confirm</Text>
        </TouchableOpacity>
      </View>
        )
      }
    </View>
    </ScrollView>
  )
}

export default DeleteAccountScreen