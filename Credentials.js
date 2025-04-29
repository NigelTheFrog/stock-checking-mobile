import { createContext } from "react";

export const CredentialContext = createContext({storedCredentials: {}, setStoredCredentials: ()=>{}})
export const BaseURL = "http://pstjktr.sos.sutindo.net:8056/api";
export const AppVersion = '7.11.5';
