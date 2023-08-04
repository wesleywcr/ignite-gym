import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/Loading";
import { ExerciseDTO } from "@dtos/exercisieDTO";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Center, FlatList, HStack, Heading, Text, VStack, useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";

export function Home(){
  const [isLoading,setIsLoading] = useState(true);
  const  [groups,setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  const [groupSelected,setGrouSelected] = useState('antebraço');

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExercisesDetails(exerciseId:string){
    navigation.navigate('Exercise',{exerciseId})
  }

  async function fetchGroups(){
    try{
      const response =  await api.get('/groups');
      setGroups(response.data)
      console.log(response)
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError?error.message:"Não foi possivel carregar os grupos musculares." 
   toast.show({
    title,
    placement:'top',
    bgColor:'red.500',
   })
    }
  }

  async function fetchExercisesByGroup(){
    try{
      setIsLoading(true)
      const response = await api.get(`/exercicies/bygroup/${groupSelected}`);
setExercises(response.data)
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError?error.message:"Não foi possivel carregar os exercicios." 
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500',
       })
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchGroups();
  },[]);

  useFocusEffect(useCallback(()=>{
    fetchExercisesByGroup();
  },[groupSelected]))

 
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
   
   {
    isLoading ? <Loading/>
    :
     <VStack flex={1} px={8}>
      <HStack justifyContent={'space-between'} marginBottom={5}>

        <Heading 
        color={'gray.200'} 
        fontSize={'md'}
        fontFamily={'heading'}>Exercicios</Heading>
        <Text color={'gray.200'} fontSize={'sm'}>{exercises.length}</Text>

      </HStack>
      
      <FlatList
       data={exercises}
       keyExtractor={item => item.id}
       renderItem={({item})=>(
          <ExerciseCard
          data={item}
            onPress={()=>handleOpenExercisesDetails(item.id)}
          />
       )}
       showsVerticalScrollIndicator={false}
       _contentContainerStyle={{paddingBottom:20}}
       />
     </VStack>
      }
    </VStack>
       
  )
}