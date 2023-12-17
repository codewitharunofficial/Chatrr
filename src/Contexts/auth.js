import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({
        user: null,
        token: ''
        
    });

    axios.defaults.headers.common["Authorization"]= auth?.token;

    useEffect(() => {
      const data = AsyncStorage.getItem('auth');
      if(data){
        setAuth({
            ...auth,
            user: data.user,
            token: data.token
        });
      }
    //eslint-disable-next-line
    }, []);
    

    return(
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export {AuthProvider, useAuth}
