import {
    useState,
    createContext,
    ReactNode,
    useContext,
} from "react";
import * as WebBrowser from "expo-web-browser";
import { AuthError, AuthRequestConfig, DiscoveryDocument, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { servers } from "@/constants/API";
import { saveTokens } from "@/utils/token";
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
    signIn: () => {console.log("sentinel")},
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
    const signIn = async () => {
        try {
          if (!request) return;
      
          const result = await promptAsync();
      
          if (result.type === 'success' && result.params?.code) {
            const code = result.params.code;
      
            const response = await fetch(`${servers[2]}/api/auth/google-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });
      
            const data = await response.json();
      
            if (!response.ok) {
              throw new Error(data.message || 'Google login failed');
            }
      
            console.log("✅ Google login success:", data);
            // Optional: store tokens
            await saveTokens(data.accessToken, data.refreshToken);
            // Optional: update user state
            setUser(data.user || null);
          } else {
            console.warn("Google auth cancelled or failed");
          }
        } catch (err) {
          console.error("Google login error:", err);
          setError(err as AuthError);
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