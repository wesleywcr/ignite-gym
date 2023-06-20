import { UserDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { ReactNode, createContext, useState } from "react";

export type AuthContextProps ={
  user: UserDTO;
  signIn:(email:string,password:string) =>Promise<void>;
}

type AuthContextProviderProps ={
  children:ReactNode;
}
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthContextProvider({children}:AuthContextProviderProps){

  const [user,setUser] = useState({} as UserDTO);

  async  function signIn(email:string, password:string){
    try{
      const {data} = await api.post('/sessions',{email,password}); 

    if(data.user){
      setUser(data.user)
    }
    }catch(error){
      throw error
    }
    
  }

  return(
    <AuthContext.Provider value={{
     user,signIn
    }}>{children}</AuthContext.Provider>
  )
}

