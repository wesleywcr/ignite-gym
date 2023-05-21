import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Skeleton, Text, VStack } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const PHONE_SIZES = 33

export function Profile(){
  const [photoIsLoading, setPhotoIsloading] = useState(false);



  return(
    <VStack flex={1}>
     <ScreenHeader title="Perfil"/>
     <ScrollView contentContainerStyle={{paddingBottom:36}}>
      <Center mt={6} px={10}>
        {
          photoIsLoading? 
          <Skeleton 
          w={PHONE_SIZES} 
          h={PHONE_SIZES} 
          rounded={'full'}
          startColor={'gray.500'}
          endColor={'gray.400'}
          />
          :
          <UserPhoto
       source={{uri:'https://github.com/wesleywcr.png'}} 
       alt="Foto do usuário"
       size={PHONE_SIZES}
       />
        }
      
       <TouchableOpacity>
        <Text color={'green.500'} 
        fontWeight={'bold'} 
        fontSize={'md'} 
        mt={2} 
        mb={8}>
          Alterar foto
          </Text>
       </TouchableOpacity>
       <Input
        bg={"gray.600"}
        placeholder="Nome"
       />
        <Input
        bg={"gray.600"}
        isDisabled
        placeholder="email@email.com"
       />
     
        <Heading color={'gray.200'} 
        fontSize={'md'} 
        mb={2}
        alignSelf={'flex-start'}
        mt={12}
        >
         Alterar senha
        </Heading>
        <Input
        bg={'gray.600'}
        placeholder="Senha antiga"
        secureTextEntry
        />
        <Input
        bg={'gray.600'}
        placeholder="Nova senha"
        secureTextEntry
        />
         <Input
        bg={'gray.600'}
        placeholder="Confirme a nova senha"
        secureTextEntry
        />
        <Button title="Atualizar" mt={4}/>
        </Center>
     </ScrollView>
    </VStack>
  )
}