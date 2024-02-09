import { createContext, useContext, useState } from "react";

const SoundContext = createContext();

const SoundProvider = ({children}) => {
    const [sound, setSound] = useState();

    return(
        <SoundContext.Provider value={[sound, setSound]} >
            {children}
        </SoundContext.Provider>
    )
};

const useSound = () => useContext(SoundContext);

export {useSound, SoundProvider}