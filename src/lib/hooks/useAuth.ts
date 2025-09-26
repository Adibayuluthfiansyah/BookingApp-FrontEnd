// hooks/useAuth.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { LoginCredentials, User } from '@/types'
import apiClient, {  
  storeAuthData, 
  removeAuthData, 
  getStoredUser, 
  isAuthenticated,
  handleApiError 
} from '@/lib/api'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

// Admin Auth Hook
export const useAdminAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        if (isAuthenticated('admin')) {
          const user = getStoredUser('admin')
          if (user) {
            setState(prev => ({ ...prev, user, loading: false }))
          } else {
            setState(prev => ({ ...prev, loading: false }))
          }
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiClient.adminLogin(credentials)
      
      if (response.success && response.data) {
        const { user, token } = response.data
        storeAuthData('admin', token, user)
        setState(prev => ({ ...prev, user, loading: false }))
        return true
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = handleApiError(error)
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return false
    }
  }, [])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      await apiClient.adminLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeAuthData('admin')
      setState({ user: null, loading: false, error: null })
      router.push('/admin/login')
    }
  }, [router])

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!isAuthenticated('admin')) return
    
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const response = await apiClient.getAuthUser()
      if (response.success && response.data) {
        const user = response.data
        storeAuthData('admin', localStorage.getItem('admin_token')!, user)
        setState(prev => ({ ...prev, user, loading: false }))
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      // If token is invalid, logout
      await logout()
    }
  }, [logout])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    logout,
    refreshUser,
    clearError,
  }
}

// Customer Auth Hook
export const useCustomerAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })
  
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        if (isAuthenticated('customer')) {
          const user = getStoredUser('customer')
          if (user) {
            setState(prev => ({ ...prev, user, loading: false }))
          } else {
            setState(prev => ({ ...prev, loading: false }))
          }
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiClient.customerLogin(credentials)
      
      if (response.success && response.data) {
        const { user, token } = response.data
        storeAuthData('customer', token, user)
        setState(prev => ({ ...prev, user, loading: false }))
        return true
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = handleApiError(error)
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return false
    }
  }, [])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      await apiClient.customerLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeAuthData('customer')
      setState({ user: null, loading: false, error: null })
      router.push('/customer/login')
    }
  }, [router])

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!isAuthenticated('customer')) return
    
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const response = await apiClient.getAuthUser()
      if (response.success && response.data) {
        const user = response.data
        storeAuthData('customer', localStorage.getItem('customer_token')!, user)
        setState(prev => ({ ...prev, user, loading: false }))
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      // If token is invalid, logout
      await logout()
    }
  }, [logout])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    logout,
    refreshUser,
    clearError,
  }
}

// Generic auth guard hook
export const useAuthGuard = (userType: 'admin' | 'customer', redirectTo?: string) => {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated(userType)
      
      if (!authenticated) {
        const defaultRedirect = userType === 'admin' ? '/admin/login' : '/customer/login'
        router.push(redirectTo || defaultRedirect)
      } else {
        setChecking(false)
      }
    }

    checkAuth()
  }, [userType, redirectTo, router])

  return { checking }
}