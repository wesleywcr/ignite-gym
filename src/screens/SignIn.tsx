
import { VStack,Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import React, { useState } from 'react';
import BackgroundImage from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRouteProps } from '@routes/auth.routes';
import { useAuth } from '@hooks/useAuth';
import { useForm } from 'react-hook-form';
import { AppError } from '@utils/AppError';

type FormData ={
  email:string;
  password:string;
}
export function SignIn() {
  const {control,handleSubmit, formState:{errors}} = useForm<FormData>();

  const navigation = useNavigation<AuthNavigatorRouteProps>();

  const toast = useToast();
  const {signIn} = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  function handleNewAccount(){
    navigation.navigate('SignUp')
  }
  async function handleSignIn({email,password}:FormData){
    setIsLoading(true);
    try{
      await signIn(email,password)
    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message :'Não foi possivel entrar. Tente novamnete'
      setIsLoading(false);
      toast.show(({
        title,
        placement:'top',
        bgColor:'red.500'
      }))
    }

  }
  return (
    <ScrollView 
    contentContainerStyle={{flexGrow:1}} 
    showsVerticalScrollIndicator={false}>
    <VStack flex={1} bg="gray.700" px={10} pb={16}>
    <Image 
     source={BackgroundImage}
     defaultSource={BackgroundImage} 
     alt='Pessoas treinando'
     resizeMode='contain'
     position={'absolute'}
     />
     <Center my={24}>

     <LogoSvg/>
     <Text color={'gray.100'} fontSize={'sm'}>Treine sua mente e o seu corpo</Text>
     </Center>
     <Center>
     <Heading color={'gray.100'} fontSize={'xl'} mb={6} fontFamily={'heading'}>
      Acesso sua conta
      </Heading>
      <Input 
      placeholder='E-mail'
      keyboardType='email-address'
      autoCapitalize='none'

    />
    <Input 
      placeholder='Senha'
      secureTextEntry

    />
    <Button title='Acessar'/>

     </Center>
<Center pt={24}>
     <Text  color={'gray.100'} fontSize={'sm' } mb={3} fontFamily={'body'} >Ainda não têm acesso?</Text>
    <Button 
    title='Criar conta'
    variant={'outline'}
    isLoading={isLoading}
    onPress={handleSubmit(handleSignIn)}
     />
    </Center>
    </VStack>
    </ScrollView>
  );
}
