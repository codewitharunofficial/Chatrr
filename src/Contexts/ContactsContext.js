import { createContext, useContext, useState } from "react";

const ContactsContext = createContext();

const ContactsProvider = ({children}) => {
    const [users, setUsers] = useState([]);

    return (
        <ContactsContext.Provider value={[users, setUsers]} >
            {children}
        </ContactsContext.Provider>
    )
};

const useContacts = () => useContext(ContactsContext);

export {useContacts, ContactsProvider}