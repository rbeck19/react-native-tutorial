import {SafeAreaView, Text, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import {images} from '../constants'
 
const index = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full h-full items-center justify-center px-4">
          <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode='contain'/>
          <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode='contain'/>
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{' '}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default index

