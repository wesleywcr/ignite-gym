
import { VStack,Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import React, { useState } from 'react';
import BackgroundImage from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { api } from '@services/api';
import axios from 'axios';
import { Alert } from 'react-native';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';

type FormDataProps ={
  name:string;
  email:string;
  password:string;
  password_confirm:string;
}

const signUpSchema = yup.object({
   name: yup.string().required('Informe o nome.'),
   email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
   password:yup.string().required('Informe a senha.').min(6,'A senha deve ter pelo menos 6 dígitos.'),
   password_confirm:yup.string().required('Confirme a senha.').oneOf([yup.ref('password'), null],'A confirmação da senha não confere')

  })
export function SignUp() {
  const {control,handleSubmit, formState:{errors}} = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation();
  const {signIn} = useAuth();

  const toast = useToast();


 async function handleSignUp({email,name,password}: FormDataProps){
    
  try{
    setIsLoading(true)
    await api.post('/users',{name,email,password})
    await signIn(email,password)

  }catch(error){
    setIsLoading(false);
    
    if(axios.isAxiosError(error)){
      const isAppError =error instanceof AppError;
      const title = isAppError? error.message : 'Não foi possivel criar a conta. Tente novamente mais tarde.'
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500'
      })
  }
  }
  
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
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
      Crie sua conta
      </Heading>
      <Controller 
        control={control}
        name='name'
        render={({field:{onChange, value}})=>(
          <Input 
          placeholder='Nome'
          onChangeText={onChange}
          value={value}
          errorMessage={errors.name?.message}
         
          />
        )}
      />
      
          <Controller 
        control={control}
        name='email'
        render={({field:{onChange, value}})=>(
          <Input 
          placeholder='E-mail'
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={onChange}
          value={value}
          errorMessage={errors.email?.message}
        />
        )}
      />
         
       <Controller 
        control={control}
        name='password'
        render={({field:{onChange, value}})=>(
          <Input 
           placeholder='Senha'
           secureTextEntry
           onChangeText={onChange}
           value={value}
           errorMessage={errors.password?.message}
            />
        )}
      />
      <Controller 
        control={control}
        name='password_confirm'
        render={({field:{onChange, value}})=>(
          <Input 
          placeholder='Confirme senha'
          secureTextEntry
          onChangeText={onChange}
          value={value}
          onSubmitEditing={handleSubmit(handleSignUp)}
          returnKeyType='send'
          errorMessage={errors.password_confirm?.message}
           />
        )}
      />
      
   
   
    <Button 
    title='Criar e acessar' 
    onPress={handleSubmit(handleSignUp)}
    isLoading={isLoading}
    />

     </Center>

    
    <Button 
    title='Voltar para login'
     variant={'outline'}
     mt={12}
     onPress={()=> navigation.goBack()}
     />

    </VStack>
    </ScrollView>
  );
}
