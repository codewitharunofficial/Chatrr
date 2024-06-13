import { View, Text, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Lightbox from 'react-native-lightbox/Lightbox.js';


const ImageViewerScreen = () => {
    const route = useRoute();
    const  navigation = useNavigation();

    const {image} = route.params.params;
  return (
    <View style={{width: '100%', height: '100%'}} >
      <Lightbox swipeToDismiss={true} useNativeDriver={true} >
      <Image resizeMode='contain' source={{uri: image}} style={{objectFit: 'contain', width: '100%', height: '100%'}} />
      </Lightbox>
    </View>
  )
}

export default ImageViewerScreen