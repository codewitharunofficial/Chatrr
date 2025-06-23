import { createContext, useContext, useState } from "react";

const ContactsContext = createContext();

const ContactsProvider = ({children}) => {
    const [users, setUsers] = useState([]);
    const [matchedContacts, setMatchedContacts] = useState([]);

    return (
        <ContactsContext.Provider value={[users, setUsers, matchedContacts, setMatchedContacts]} >
            {children}
        </ContactsContext.Provider>
    )
};

const useContacts = () => useContext(ContactsContext);

export {useContacts, ContactsProvider}