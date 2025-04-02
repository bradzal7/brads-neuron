# Authentication Flow

This document describes the authentication flow in Neuron Log, which uses Supabase Auth for user authentication.

## Overview

Neuron Log implements a secure, token-based authentication system using Supabase Auth. The flow includes:

1. User sign-up with email/password
2. User sign-in with email/password
3. Session persistence
4. Protected routes
5. Sign-out functionality

## Components

The authentication system consists of the following components:

### 1. AuthContext (React Context)

Located at `app/components/Auth/AuthContext.tsx`, this context manages the auth state across the application:

```typescript
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);
```

### 2. AuthProvider Component

Wraps the application and provides auth state to all components:

```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Navigate based on auth status
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/signin');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 3. Protected Layout Component

Prevents unauthenticated users from accessing protected pages:

```typescript
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Router will redirect, this prevents flash of content
  }

  return <>{children}</>;
}
```

### 4. SignIn Component

Handles user sign-in:

```typescript
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setMessage({ text: 'Successfully signed in!', type: 'success' });
      // Redirect will happen through auth state change listener
    } catch (error: any) {
      setMessage({ text: error.message || 'Error signing in', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Form rendering...
}
```

### 5. SignUp Component

Handles new user registration:

```typescript
export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSignUp = async (e: React.FormEvent) => {
    // Validation and sign-up logic...
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    // Error handling and feedback...
  };
  
  // Form rendering...
}
```

## Authentication Flow Details

### User Sign-Up

1. User navigates to `/signup`
2. User enters email, password, and confirms password
3. Client-side validation ensures passwords match and meet requirements
4. Credentials are sent to Supabase Auth
5. Supabase creates a new user and sends a confirmation email (if enabled)
6. User is informed of successful registration

### User Sign-In

1. User navigates to `/signin`
2. User enters email and password
3. Credentials are sent to Supabase Auth
4. Upon successful authentication, Supabase returns a session token
5. Session token is stored in browser local storage
6. AuthProvider updates the auth state with the user information
7. User is redirected to the dashboard

### Session Persistence

1. On application load, AuthProvider checks for an existing session
2. If a valid session exists, the user object is set in the auth context
3. Auth state listener monitors for changes to the session
4. If the session expires or is invalidated, the user is redirected to sign-in

### Protected Routes

1. Protected routes use the ProtectedLayout component
2. ProtectedLayout checks if a user is authenticated
3. If not authenticated, the user is redirected to sign-in
4. If authenticated, the requested page is rendered

### Sign-Out

1. User clicks the sign-out button
2. Supabase Auth is called to invalidate the session
3. Local storage session data is cleared
4. Auth state listener detects the change and updates the context
5. User is redirected to the sign-in page

## Security Considerations

1. **Password Management**: Passwords are never stored in our application; Supabase handles all password management
2. **Token Storage**: Supabase securely stores tokens in local storage with appropriate expiration
3. **Row-Level Security**: Database policies ensure users can only access their own data
4. **HTTPS**: All communication between the client and Supabase is encrypted using HTTPS

## Future Enhancements

1. **Social Auth**: Add sign-in with Google, GitHub, etc.
2. **Two-Factor Authentication**: Implement 2FA for improved security
3. **Password Recovery**: Add robust password recovery flow
4. **Session Management**: Allow users to view and manage active sessions
5. **Role-Based Access Control**: Implement different user roles (admin, regular user, etc.) 