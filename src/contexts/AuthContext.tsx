import { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextProps ={
  user: UserDTO;
  signIn:(email:string,password:string) =>Promise<void>;
  isLoadingUserStorageData:boolean;
  updateUserProfile: (userUpdated:UserDTO) => Promise<void>;
  signOut:()=> Promise<void>;
}

type AuthContextProviderProps ={
  children:ReactNode;
}
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthContextProvider({children}:AuthContextProviderProps){

  const [user,setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData,setIsLoadingUserStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token:string) { 
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(userData);
      
    }
    async function storageUserAndTokenSave(userData: UserDTO, token:string,refresh_token:string) { 
      try{
        setIsLoadingUserStorageData(true);
        await storageUserSave(userData);
        await storageAuthTokenSave({token,refresh_token});
      }catch(error:any){
        throw error;
      }finally{
        setIsLoadingUserStorageData(false)
      }

      
    }

  async  function signIn(email:string, password:string){
    try{
      const {data} = await api.post('/sessions',{email,password}); 

    if(data.user && data.token && data.refresh_token){
      setIsLoadingUserStorageData(true)
     await storageUserAndTokenSave(data.user,data.token,data.refresh_token)
      userAndTokenUpdate(data.user,data.token);
    }
    }catch(error){
      throw error
    }finally{
      setIsLoadingUserStorageData(false)
    }
    
  }
  async function signOut() {
      try{
        setIsLoadingUserStorageData(true);
        setUser({} as UserDTO);

        await storageUserRemove();
        await storageAuthTokenRemove();
      }catch(error){
        throw error;
      }finally{
        setIsLoadingUserStorageData(false);
      }
    
  }

  async function updateUserProfile(userUpdated:UserDTO) {
    try{
      setUser(userUpdated);
      await storageUserSave(userUpdated)
    }catch(error){
      throw error
    }
    
  }
  async function loadUserData() {
    try{
      setIsLoadingUserStorageData(true);
      const userLogged = await storageUserGet();
      const {token} = await storageAuthTokenGet();

    if( token && userLogged){
      userAndTokenUpdate(userLogged, token)
    }
    }catch(error){
      throw error;

    }finally{
      setIsLoadingUserStorageData(false);
    }
    
  }
  useEffect(()=>{
    loadUserData();
  },[])
  
  useEffect(()=>{
   const subscribe = api.registerInterceptTokenManager(signOut);

   return ()=>{
    subscribe
   }
  },[signOut])

  return(
    <AuthContext.Provider value={{
     user,
     signIn,
     isLoadingUserStorageData,
     signOut,
     updateUserProfile
    }}>{children}</AuthContext.Provider>
  )
}

