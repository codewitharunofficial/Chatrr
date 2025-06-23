import { createContext, useContext, useState } from "react";
import { DefaultTheme } from "../Components/utils/ThemeColors";

const Themecontext = createContext();

const ThemeProvider = ({children}) => {

    const [theme, setTheme] = useState(DefaultTheme);

return (
    <Themecontext.Provider value={[theme, setTheme]} >
        {children}
    </Themecontext.Provider>
);
};

const useTheme = () => useContext(Themecontext);

export {useTheme, ThemeProvider}