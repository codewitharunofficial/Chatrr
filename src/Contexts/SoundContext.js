import { createContext, useContext, useState } from "react";

const SoundContext = createContext();

const SoundProvider = ({children}) => {
    const [sound, setSound] = useState();
    const [currentTrack, setCurrentTrack] = useState(null);


    return(
        <SoundContext.Provider value={[sound, setSound, currentTrack, setCurrentTrack]} >
            {children}
        </SoundContext.Provider>
    )
};

const useSound = () => useContext(SoundContext);

export {useSound, SoundProvider}