
import { useState, useEffect, createContext, useContext } from 'react'
import { useToast } from "@/hooks/use-toast";

// Temporary mock auth functions (frontend-only mode)
const signIn = async (email: string, password: string) => {
  // pretend login always succeeds if email & password are not empty
  if (email && password) {
    return {
      data: { user: { id: "123", email } },
      error: null,
    };
  }
  return {
    data: { user: null },
    error: { message: "Invalid credentials" },
  };
};

const signOut = async () => {
  return { error: null };
};

const refreshUser = async () => {
  // Mock refreshing user
  return { id: "123", email: "test@example.com" };
};


interface AuthContextType {
  user: SystemUser | null
  session: any
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  refreshUser: async () => {},
  isAuthenticated: false
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SystemUser | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { data, error } = await signIn(email, password)
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      if (data.user) {
        toast({
          title: "Login Successful",
          description: `Welcome back to CBC School Management System!`,
        })
        return true
      }

      return false
    } catch (error: any) {
      toast({
        title: "Login Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await signOut()
      setUser(null)
      setSession(null)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!session && !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
