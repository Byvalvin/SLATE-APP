import {
    useState,
    createContext,
    ReactNode,
    useContext,
} from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthError, AuthRequestConfig, DiscoveryDocument, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { servers } from "@/constants/API";
// import { discovery } from "expo-auth-session/providers/google";


WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
    id: string;
    email: string;
    name: string;
    image?: string;
    verified?: boolean;
    provider?: string;
    exp?: number;
    cookieExp?: number;
}


const GauthContext = createContext({
    user: null as AuthUser | null,
    signIn: () => {},
    signOut: () => {},
    fetchWithAuth: async (url:string, options?:RequestInit) => Promise.resolve(new Response),
    isLoading: false,
    error: null as AuthError | null,
});

const config: AuthRequestConfig = {
    clientId: "google",
    scopes: ["openid", "profile" ,"email"],
    redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
    authorizationEndpoint: `${servers[2]}/api/auth/google-signin`,
    tokenEndpoint: `${servers[2]}/api/auth/google-token`,
};

export const GauthProvider = ({children}: {children: ReactNode})=>{
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null)

    const [request, response, promptAsync] = useAuthRequest(config, discovery)
    const signIn = async()=>{
        try {
            if(!request){
                console.log("no request");
                return;
            }
            await promptAsync();
        } catch (error) {
            console.log(error);
        }
    };
    const signOut = async()=>{};
    const fetchWithGauth = async(url:string, options?:RequestInit)=>{};

    return (
        <GauthContext.Provider
            value={({
                user,
                signIn,
                signOut,
                fetchWithGauth,
                isLoading,
                error,
            })}
        >
            {children}
        </GauthContext.Provider>
    );
};

// hooks
export const useGauth = ()=> {
    const context = useContext(GauthContext);
    if (!context){
        throw new Error("useAuth must be used within a GauthProver");

    }
    return context; 
}; 