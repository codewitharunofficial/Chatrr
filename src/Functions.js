import axios from "axios";
import * as Notifications from "expo-notifications";
import socketServcies from "./Utils/SocketServices";


//For Fecthing Chats
export const getChats = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/messages/chats/${id}`
      );

      if (data?.success === true) {
        return data;
      }
    } catch (error) {
      return error.message;
    }
  };


  //For Push-Notification

  //Defining Notification category


  export const sendPushNotificationForIncomingCall = async (name, senderPhoto) => {
    try {
      await Notifications.setNotificationCategoryAsync('incoming-call', [
        {
          identifier: 'answer',
          buttonTitle: 'Answer',
          options:{
            openAppToForeground: true
          },
        },
        {
          identifier: 'decline',
          buttonTitle: 'Reject',
          options: {
            opensAppToForeground: false
          },
        },
      ]);


     await Notifications.addNotificationReceivedListener(response => {
        const {actionIdentifier} = response;
          if(actionIdentifier === 'answer'){
              console.log("Call Answered");
          } else if(actionIdentifier === 'decline') {
              console.log("Call Declined");
          }
      })


      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Incoming Call`,
          body: `${name} is calling you`,
          data: {name, senderPhoto},
          priority: Notifications.AndroidNotificationPriority.MAX,
          sound: true,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null,
      });
    } catch (error) {
      console.log(error.message);
    }
  };


  export const call = async (sender, reciever, name, senderPhoto) => {
    socketServcies.emit('call', {sender, receiver: reciever, name, senderPhoto: senderPhoto});
    console.log("Calling...!");
  };
  