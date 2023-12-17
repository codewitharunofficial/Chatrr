import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../Contexts/auth'

const UserProfileScreen = () => {

    const [auth] = useAuth();

  return (
    <View>
      <Text>{auth.user.name}</Text>
    </View>
  )
}

export default UserProfileScreen