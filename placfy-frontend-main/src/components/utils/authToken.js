const TOKEN_KEY = 'placfy_auth_token'
const SESSION_TOKEN_KEY = 'placfy_session_auth_token'
const USER_KEY = 'placfy_user'
const SESSION_USER_KEY = 'placfy_session_user'

// localStorage token functions
export const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}
export const storeToken = (token) => {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
}
export const clearStoredToken = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

// sessionStorage token functions
export const getSessionToken = () => {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(SESSION_TOKEN_KEY)
}
export const storeSessionToken = (token) => {
  if (typeof window === 'undefined') return
  if (token) sessionStorage.setItem(SESSION_TOKEN_KEY, token)
}
export const clearSessionToken = () => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
}

// localStorage user functions
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}
export const storeUser = (user) => {
  if (typeof window === 'undefined') return
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}
export const clearUser = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

// sessionStorage user functions
export const getSessionUser = () => {
  if (typeof window === 'undefined') return null
  const user = sessionStorage.getItem(SESSION_USER_KEY)
  return user ? JSON.parse(user) : null
}
export const storeSessionUser = (user) => {
  if (typeof window === 'undefined') return
  if (user) sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
}
export const clearSessionUser = () => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_USER_KEY)
}

export const clearAuthCookie = () => {
  if (typeof window === 'undefined') return;
  document.cookie = "placfy_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const AUTH_TOKEN_KEY = TOKEN_KEY
