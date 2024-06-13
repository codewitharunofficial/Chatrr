import { createContext, useState } from "react";

const PlayerControls = createContext();

const ControlsContext = ({children}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [trackIndex, setTrackIndex] = useState(0);


    return (
        <PlayerControls.Provider value={{isPlaying, setIsPlaying, position, setPosition, progress, setProgress, duration, setDuration, isLooping, setIsLooping, currentSound, setCurrentSound, trackIndex, setTrackIndex}} >
            {children}
        </PlayerControls.Provider>
    )
}

export {PlayerControls, ControlsContext};