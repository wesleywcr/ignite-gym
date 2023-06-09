import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Center, FlatList, HStack, Heading, Text, VStack } from "native-base";
import { useState } from "react";

export function Home(){
  const  [groups,setGroups] = useState(['costas','Biceps','ombro','Triceps'])
  const [exercises, setExercises] = useState(['Puxada frontal','Remada','Levantamento'])
  const [groupSelected,setGrouSelected] = useState('costas');

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExercisesDetails(){
    navigation.navigate('Exercise')
  }
  return(
    <VStack flex={1}>
     <HomeHeader/>
     <FlatList
      data={groups}
      keyExtractor={item => item}
      renderItem={({item})=>(
        <Group 
        name={item}
        isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
        onPress={()=> setGrouSelected(item)}
        
        />
  )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{px:8}}
        my={10}
        maxHeight={10}
        minHeight={10}
     />
   
     <VStack flex={1} px={8}>
      <HStack justifyContent={'space-between'} marginBottom={5}>

        <Heading color={'gray.200'} fontSize={'md'} fontFamily={'heading'}>Exercicios</Heading>
        <Text color={'gray.200'} fontSize={'sm'}>{exercises.length}</Text>

      </HStack>
      
      <FlatList
       data={exercises}
       keyExtractor={item => item}
       renderItem={({item})=>(
          <ExerciseCard
            onPress={handleOpenExercisesDetails}
          />
       )}
       showsVerticalScrollIndicator={false}
       _contentContainerStyle={{paddingBottom:20}}
       />
      </VStack>
    </VStack>
  )
}