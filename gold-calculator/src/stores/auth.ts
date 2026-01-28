import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])

  // Load users from localStorage on initialization
  const loadUsers = () => {
    const storedUsers = localStorage.getItem('gold-calculator-users')
    if (storedUsers) {
      try {
        users.value = JSON.parse(storedUsers)
      } catch (error) {
        console.error('Error parsing stored users:', error)
        users.value = []
      }
    } else {
      users.value = []
    }

    const storedCurrentUser = localStorage.getItem('gold-calculator-current-user')
    if (storedCurrentUser) {
      try {
        currentUser.value = JSON.parse(storedCurrentUser)
      } catch (error) {
        console.error('Error parsing stored current user:', error)
        currentUser.value = null
      }
    }
  }

  // Save users to localStorage
  const saveUsers = () => {
    localStorage.setItem('gold-calculator-users', JSON.stringify(users.value))
  }

  // Save current user to localStorage
  const saveCurrentUser = () => {
    if (currentUser.value) {
      localStorage.setItem('gold-calculator-current-user', JSON.stringify(currentUser.value))
    } else {
      localStorage.removeItem('gold-calculator-current-user')
    }
  }

  // Register a new user
  const register = (email: string, password: string, name: string): { success: boolean; message: string } => {
    try {
      // Check if user already exists
      const existingUser = users.value.find(user => user.email === email)
      if (existingUser) {
        return { success: false, message: 'Email already registered' }
      }

      // Validate input
      if (!email.trim() || !password.trim() || !name.trim()) {
        return { success: false, message: 'All fields are required' }
      }

      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' }
      }

      // Create new user (in a real app, you'd hash the password)
      const newUser: User = {
        id: Date.now().toString(),
        email: email.trim().toLowerCase(),
        name: name.trim(),
        createdAt: new Date().toISOString()
      }

      // Store user credentials separately (simplified - in real app use proper auth)
      const credentials = JSON.parse(localStorage.getItem('gold-calculator-credentials') || '{}')
      credentials[email.trim().toLowerCase()] = { password, userId: newUser.id }
      localStorage.setItem('gold-calculator-credentials', JSON.stringify(credentials))

      users.value.push(newUser)
      saveUsers()

      currentUser.value = newUser
      saveCurrentUser()

      return { success: true, message: 'Registration successful' }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'Registration failed due to technical error' }
    }
  }

  // Login user
  const login = (email: string, password: string): { success: boolean; message: string } => {
    try {
      const credentials = JSON.parse(localStorage.getItem('gold-calculator-credentials') || '{}')
      const userCred = credentials[email]

      if (!userCred) {
        return { success: false, message: 'No account found with this email. Please register first.' }
      }

      if (userCred.password !== password) {
        return { success: false, message: 'Invalid password' }
      }

      const user = users.value.find(u => u.id === userCred.userId)
      if (!user) {
        return { success: false, message: 'User account corrupted. Please register again.' }
      }

      currentUser.value = user
      saveCurrentUser()

      return { success: true, message: 'Login successful' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed due to technical error' }
    }
  }

  // Logout user
  const logout = () => {
    currentUser.value = null
    saveCurrentUser()
  }

  // Computed
  const isAuthenticated = computed(() => !!currentUser.value)

  // Initialize
  loadUsers()

  return {
    currentUser,
    isAuthenticated,
    register,
    login,
    logout
  }
})