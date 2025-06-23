import * as Toast from 'react-native-simple-toast';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../Contexts/auth';
import { useState } from 'react';


const {photo, setPhoto} = useState('');
export const sendPhoto = async (sender, receiver, photo) => {

      
    const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();


     if(granted.status !== 'granted' ) {
      Toast.show("Sorry, Please Allow to Procceed Further")
     } else {

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

          try {
           const formdata = new FormData();
           if(!res) return
   
   
           formdata.append('profilePhoto', {
            name: new Date() + '_profile',
            uri: photo,
            type: 'image/jpg'
           });
           
           
           const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/upload/${id}`, formdata, {
            headers:{
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
           });
             
             if(data?.success === true){
              setProfilePhoto(data?.user?.profilePhoto?.secure_url);
                setAuth({
                  ...auth,
                  user: data.user,
                  token: auth.token
                });
                Toast.show(data?.message);
             } else {
                Toast.show(data?.message)
             }
   
          } catch (error) {
              console.log(error.message);
              Toast.show(error.message + ", " + "Please Try Again");
          }
        }
  };
