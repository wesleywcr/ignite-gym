import {  Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/exercisieDTO";
import { Loading } from "@components/Loading";

type RoutesParamsProps ={
  exerciseId:string;
}
export function Exercise(){

  const [sendingRegister,setSendingRegister] = useState(false);
  const [isLoading,setIsLoading] = useState(true);

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast();
  const route = useRoute();
  
  const  {exerciseId} = route.params as RoutesParamsProps
  
  const [exercise,setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  function handleGoBack(){
      navigation.goBack();
  }

  async function fetchExerciseDetails(){
    try{
      setIsLoading(true);
     const response = await  api.get(`/exercises/${exerciseId}`)
     setExercise(response.data)
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError?error.message:"Não foi possivel carregar os detalhes do exercício" 
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500',
       })
    }finally{
      setIsLoading(false);
    }
  }
  async function handleExerciseHistoryRegister(){
    try{
      setSendingRegister(true);
      await api.post('/history',{exercise:exerciseId})


      toast.show({
        title:'Parabéns! Exercício resgitrado no seu histórico.',
        placement:'top',
        bgColor:'green.700',
       });

       navigation.navigate('History');
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError?error.message:"Não foi possivel registrar o exercício" 
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500',
       })
    }finally{
      setSendingRegister(false);
    }
  }

  useEffect(()=>{
    fetchExerciseDetails();
  },[exerciseId])
  return(
    <VStack flex={1}>

  <VStack px={8} bg={'gray.600'} pt={12}>
    <TouchableOpacity onPress={handleGoBack}>
      <Icon as={Feather} name="arrow-left" color={'gray.500'} size={6}/>
    </TouchableOpacity>
    <HStack 
    justifyContent={'space-between'} 
    mt={4} 
    mb={8} 
    alignItems={'center'}>
      <Heading 
      color={'gray.100'} 
      fontSize={'lg'}
      fontFamily={'heading'}
      flexShrink={1}
      >
       {exercise.name}
      </Heading>
      <HStack alignItems={'center'}>
        <BodySvg />
        <Text color={'gray.200'} ml={1} textTransform={'capitalize'}>
         {exercise.group}
          </Text>
      </HStack>
    </HStack>
  </VStack>
  <ScrollView>
    {isLoading ? <Loading/> :(


      <VStack p={8}>
        <Box   
         rounded={'lg'}  
         mb={3}  
         overflow={'hidden'}
         >
        <Image  
        w={'full'} 
        h={80}
        source={{uri:`${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`}} 
        alt="Nome do exercicio"
       
        resizeMode="cover"
        rounded={'lg'}
        />
         </Box>
        <Box bg={'gray.600'} rounded={'md'} pb={4} px={4}>
          <HStack
           alignItems={'center'} 
          justifyContent={'space-around'} 
          mb={6}
          mt={5}
          >
          <HStack>
            <SeriesSvg/>
            <Text color={'gray.200'} ml={'2'}>
             {exercise.series} séries
            </Text>
          </HStack>

          <HStack>
            <RepetitionsSvg/>
            <Text color={'gray.200'} ml={'2'}>
            {exercise.repetitions} repetições
            </Text>
          </HStack>
          </HStack>
          <Button 
          title="Marcar como realizado"
          onPress={ handleExerciseHistoryRegister}
          isLoading={sendingRegister}
          />
        </Box>
        
      </VStack>
          )}
      </ScrollView>
    </VStack>
  )
}