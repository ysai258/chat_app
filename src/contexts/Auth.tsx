import {GoogleSignin, User} from '@react-native-google-signin/google-signin';
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
  ReactNode,
} from 'react';
import {useMutation} from 'react-query';
import {AddUser} from '../apis/Login.api';

interface AuthData {
  email: string;
  userId: string;
  userName: string;
  image: string;
}
type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProps {
  children: ReactNode;
}
const AuthProvider: FC<AuthProps> = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>();

  const [loading, setLoading] = useState(false);
  const addUser = useMutation({
    mutationFn: AddUser,
    onSuccess(data, variables, context) {
      setAuthData({
        email: data.email,
        userName: data.username,
        userId: data._id,
        image: data.img,
      });
    },
    
  });

  const setUser = (userInfo: User | null) => {
    if (userInfo) {
      const email = userInfo.user.email;
      const username = userInfo.user.name || email;
      const img = userInfo.user.photo || '';
      addUser.mutate({email, username, img});
    }
  };
  useEffect(() => {
    const getUser = async () => {
      const user = await GoogleSignin.getCurrentUser();
      setUser(user);
    };
    getUser();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    GoogleSignin.configure();
    await GoogleSignin.signOut();
    setAuthData(undefined);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{authData, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthContext, AuthProvider, useAuth};
