import { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { storageAuthTokenSave } from "@storage/storageToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextProps ={
  user: UserDTO;
  signIn:(email:string,password:string) =>Promise<void>;
  isLoadingUserStorageData:boolean;
  signOut:()=> Promise<void>;
}

type AuthContextProviderProps ={
  children:ReactNode;
}
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthContextProvider({children}:AuthContextProviderProps){

  const [user,setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData,setIsLoadingUserStorageData] = useState(true);

    async function storageUserAndToken(userData: UserDTO, token:string) { 
     try{

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsLoadingUserStorageData(true)

      await storageUserSave(user);
      await storageAuthTokenSave(token)
      setUser(user);
     }catch(error){
      throw error
     }finally{
      setIsLoadingUserStorageData(false)
     }
    
      
    }
  async  function signIn(email:string, password:string){
    try{
      const {data} = await api.post('/sessions',{email,password}); 

    if(data.user && data.token){
     
    
      storageUserAndToken(data.user,data.token);
    }
    }catch(error){
      throw error
    }
    
  }
  async function signOut() {
      try{
        setIsLoadingUserStorageData(true);
        setUser({} as UserDTO)
        await storageUserRemove()
      }catch(error){
        throw error
      }finally{
        setIsLoadingUserStorageData(false);
      }
    
  }
  async function loadUserData() {
    try{
      const userLogged = await storageUserGet();

    if(userLogged){
      setUser(userLogged)
      setIsLoadingUserStorageData(false)
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

  return(
    <AuthContext.Provider value={{
     user,
     signIn,
     isLoadingUserStorageData,
     signOut
    }}>{children}</AuthContext.Provider>
  )
}

