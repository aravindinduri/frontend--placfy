export function getAccess() {
  try {
    const raw = localStorage.getItem('placfy_access')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAccess(access) {
  localStorage.setItem('placfy_access', JSON.stringify(access))
}

export function hasRole(role) {
  const a = getAccess()
  if (!a?.access_type) return false
  if (a.access_type === 'both') return true
  return a.access_type === role
}


