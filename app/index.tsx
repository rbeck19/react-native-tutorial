import {Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

import { styled } from 'nativewind';

const StyledView = styled(View);

const index = () => {
  return (
    <StyledView className="flex-1 items-center justify-center bg-red-100">
      <Text>index page</Text>

      <Link href="/profile" style={{color:'blue'}}>Go to Profile</Link>
    </StyledView>
  )
}

export default index

