import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({children})=>{
    const [auth, setAuth] = useState({
        user: null,
        
    });
    useEffect(() => {
        const getUser = async () => {

            const token = await AsyncStorage.getItem('token');

            axios.defaults.headers.common["Authorization"] = token

            const res = await AsyncStorage.getItem('auth');
            const user = JSON.parse(res);
            if(user) {
                setAuth({
                    ...auth,
                    user: user.user,
                })
        }
            
        }
        getUser();
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
