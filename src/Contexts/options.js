import { createContext, useState } from "react";

const Options = createContext();

const OptionsProvider = ({children}) => {
    const [options, setOptions] = useState(false);

return (
    <Options.Provider value={{options, setOptions}} >
       {children}
    </Options.Provider>
)

}

export {Options, OptionsProvider}