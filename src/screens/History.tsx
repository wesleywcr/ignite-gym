import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Center, Heading, Text, VStack,SectionList } from "native-base";
import { useState } from "react";


export function History(){
  const [exercises, setExercises] =useState([{
    title:'26.06.22',
    data:['Puxada frontal','Remada']
  },{
    title:'25.06.22',
    data:['Puxada frontal',]
  }
  ]);
  return(
    <VStack flex={1}>
    <ScreenHeader title='Histórico de Exercícios'/>

    <SectionList
      sections={exercises}
      keyExtractor={item => item}
      renderItem={({item})=>(
        <HistoryCard/>
      )}
      renderSectionHeader={({section})=>(
        <Heading color={'gray.200'} fontSize={'md'} mt={10} mb={3} fontFamily={'heading'}>
          {section.title}
        </Heading>
      )}
      px={8}
      contentContainerStyle={exercises.length === 0 && {flex:1, justifyContent:'center'}}
      ListEmptyComponent={()=>(
        <Text color={'gray.200'} textAlign={'center'}>
          Não há exercícios registrados ainda.{'\n'}
          Vamos fazer ecercícios hoje?
        </Text>
      )}
      showsVerticalScrollIndicator={false}  
    />
   
    </VStack>
  )
}