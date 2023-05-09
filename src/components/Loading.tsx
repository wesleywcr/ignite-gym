import { Center, Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';



export function Loading() {
  return (
  <Center flex={1}>
    <Spinner/>
  </Center>
     
  
  );
}