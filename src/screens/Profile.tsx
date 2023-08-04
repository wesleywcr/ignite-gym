import { Button } from "@components/Button";
import { Input } from "@components/Input";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import defautlUserPhotoImg from '@assets/userPhotoDefault.png'

const PHONE_SIZES = 33
type FormDataProps={
  name:string;
  email:string;
  password:string;
  old_password:string;
  confirm_password:string;
}

const profileSchema = yup.object({
  name: yup.string().required('Infome o nome.'),
  password: yup.string()
  .min(6,'A senha deve ter pelo menos 6 digítos.')
  .nullable()
  .transform((value)=>  !!value?value:null),

  confirm_password:yup.string()
  .nullable()
  .transform((value)=>  !!value?value:null)
  .oneOf([yup.ref('password'),null], "A confirmação de senha não confere.")
  .when('password',{
    is:(Field:any) => Field,
    then: yup.string()
    .nullable()
    .required('Informe a confirmação da senha.')
    .transform((value)=>  !!value?value:null)
  })
})

export function Profile(){
  const [isUpdating,setIsUpdating] = useState(false);

  const [photoIsLoading, setPhotoIsloading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('')
  
  const Toast = useToast();

  const {user, updateUserProfile} = useAuth();
  const  { control,handleSubmit,formState:{errors}} = useForm<FormDataProps>({
    defaultValues:{
      name:user.name,
      email:user.email
    },
    resolver:yupResolver(profileSchema)
     
    
  });



  async function handleUserPhotoSelect() {
    try{
      setPhotoIsloading(true);

      const photoSelected =  await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality:1,
        aspect:[4,4],
        allowsEditing:true,
      });
      if(photoSelected.canceled){
        return;
      }
      if (!photoSelected.canceled) {
        const photoInfo = FileSystem.getInfoAsync(photoSelected.assets[0].uri)
      console.log('if',(await photoInfo).uri)
         if(photoInfo && (photoInfo.size/1024/1024)>5){
        return  Toast.show({
          title:'Essa imagem é muito grande. Escolha uma até 5mb.',
          placement:'top',
          bgColor:'red.500'
        })
       }
       const fileExtension = photoSelected.assets[0].uri.split('.').pop()

       const photoFile = {
        name: `${user.name}.${fileExtension}`.toLowerCase(),
        uri:photoSelected.assets[0].uri,
        tyoe:`${photoSelected.assets[0].type}/${fileExtension}`
       } as any

       const userPhotoUploadForm = new FormData();
       userPhotoUploadForm.append('avatar',photoFile)

      const avatarUpdatedResponse =  await api.patch('/users/avatar',userPhotoUploadForm,{
        headers:{
          'Content-Type':'multipart/form-data'
        }
       })
       const userUpdated = user;
       userUpdated.avatar = avatarUpdatedResponse.data.avatar

       updateUserProfile(userUpdated)

       Toast.show({
        title:'Foto atualizada, com sucesso!',
        placement:'top',
        bgColor:'green'
       })
      }
    }catch(error:any){
      console.error('Erro')
    }finally{
      setPhotoIsloading(false);
    }
  
   
  }
  async function handleProfileUpdate(data:FormDataProps){
try{
  setIsUpdating(true);
  const userUpdated = user;
  userUpdated.name = data.name

  await api.put('/users',data);

  await updateUserProfile(userUpdated);
  Toast.show({
    title:"Perfil atualizado com sucesso!",
    placement:"top",
    bgColor:"green.500"
  })
}catch(error){
    const isAppError = error instanceof AppError;
    const title = isAppError ? error.message:"Não foi possivel atualizar os dados. Tente mais tarde"

    Toast.show({
      title,
      placement:"top",
      bgColor:"red.500"
    })
}finally{
  setIsUpdating(false);
}
  }

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
          source={user.avatar? 
            { uri:`${api.defaults.baseURL}/avatar/${user.avatar}
            `} : defautlUserPhotoImg}
       alt="Foto do usuário"
       size={PHONE_SIZES}
       />
        }
      
       <TouchableOpacity onPress={ handleUserPhotoSelect}>
        <Text color={'green.500'} 
        fontWeight={'bold'} 
        fontSize={'md'} 
        mt={2} 
        mb={8}>
          Alterar foto
          </Text>
       </TouchableOpacity>

       <Controller
        control={control}
        name="name"
        render={({field:{value, onChange}})=>(
          <Input
          bg={"gray.600"}
          placeholder="Nome"
          onChangeText={onChange}
          value={value}
          errorMessage={errors.name?.message}
         />
        )}
       />
       
       <Controller
        control={control}
        name="email"
        render={({field:{value, onChange}})=>(
          <Input
          bg={"gray.600"}
          isDisabled
          placeholder="email@email.com"
          onChangeText={onChange}
          value={value}
         />
        )}
       />
     
        <Heading color={'gray.200'} 
        fontSize={'md'} 
        mb={2}
        alignSelf={'flex-start'}
        mt={12}
        fontFamily={'heading'}
        >
         Alterar senha
        </Heading>

        <Controller
        control={control}
        name="old_password"
        render={({field:{ onChange}})=>(
          <Input
          bg={"gray.600"}
          placeholder="Senha antiga"
          secureTextEntry
          onChangeText={onChange}
        
         />
        )}
       />
        <Controller
        control={control}
        name="password"
        render={({field:{ onChange}})=>(
          <Input
          bg={"gray.600"}
          placeholder="Nova senha"
          secureTextEntry
          onChangeText={onChange}
          errorMessage={errors.password?.message}
         />
        )}
       />

        <Controller
        control={control}
        name="confirm_password"
        render={({field:{ onChange}})=>(
          <Input
          bg={"gray.600"}
          placeholder="Confirme a nova senha"
          secureTextEntry
          onChangeText={onChange}
          errorMessage={errors.confirm_password?.message}
         
         />
        )}
       />
        
    
      
        <Button 
        title="Atualizar"
         mt={4} 
         isLoading={isUpdating}
         onPress={handleSubmit(handleProfileUpdate)}/>
        </Center>
     </ScrollView>
    </VStack>
  )
}