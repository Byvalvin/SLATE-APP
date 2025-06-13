import 
{
    useState,
    createContext,
    ReactNode,
    useContext,
} from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthError } from "expo-auth-session";


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

export const GauthProvider = ({children}: {children: ReactNode})=>{
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null)

    const signIn = async()=>{};
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