import React, { useState, useEffect, useContext, createContext } from 'react'
import * as apiService from '../services/api'

// Enterprise Authentication Context
const EnterpriseAuthContext = createContext()

export const useEnterpriseAuth = () => {
  const context = useContext(EnterpriseAuthContext)
  if (!context) {
    throw new Error('useEnterpriseAuth must be used within EnterpriseAuthProvider')
  }
  return context
}

// Role-Based Access Control (RBAC) System
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  TENANT_ADMIN: 'tenant_admin', 
  MANAGER: 'manager',
  ANALYST: 'analyst',
  VIEWER: 'viewer'
}

const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_EXECUTIVE_DASHBOARD: 'view_executive_dashboard',
  EXPORT_REPORTS: 'export_reports',
  
  // Data permissions
  CREATE_CALCULATIONS: 'create_calculations',
  EDIT_CALCULATIONS: 'edit_calculations',
  DELETE_CALCULATIONS: 'delete_calculations',
  VIEW_ALL_CALCULATIONS: 'view_all_calculations',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_TENANTS: 'manage_tenants',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_INTEGRATIONS: 'manage_integrations',
  
  // System permissions
  SYSTEM_ADMIN: 'system_admin',
  API_ACCESS: 'api_access'
}

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.TENANT_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_EXECUTIVE_DASHBOARD,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.CREATE_CALCULATIONS,
    PERMISSIONS.EDIT_CALCULATIONS,
    PERMISSIONS.DELETE_CALCULATIONS,
    PERMISSIONS.VIEW_ALL_CALCULATIONS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_INTEGRATIONS,
    PERMISSIONS.API_ACCESS
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_EXECUTIVE_DASHBOARD,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.CREATE_CALCULATIONS,
    PERMISSIONS.EDIT_CALCULATIONS,
    PERMISSIONS.VIEW_ALL_CALCULATIONS,
    PERMISSIONS.API_ACCESS
  ],
  [ROLES.ANALYST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.CREATE_CALCULATIONS,
    PERMISSIONS.EDIT_CALCULATIONS,
    PERMISSIONS.API_ACCESS
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EXPORT_REPORTS
  ]
}

// Enterprise Auth Provider Component
export const EnterpriseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [tenant, setTenant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [permissions, setPermissions] = useState([])

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('enterprise_token')
      if (token) {
        const userData = await apiService.validateEnterpriseToken(token)
        if (userData) {
          setUser(userData.user)
          setTenant(userData.tenant)
          setPermissions(ROLE_PERMISSIONS[userData.user.role] || [])
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      localStorage.removeItem('enterprise_token')
    } finally {
      setIsLoading(false)
    }
  }

  // SSO Login Methods
  const loginWithSSO = async (provider, credentials) => {
    try {
      setIsLoading(true)
      const response = await apiService.ssoLogin(provider, credentials)
      
      if (response.success) {
        localStorage.setItem('enterprise_token', response.token)
        setUser(response.user)
        setTenant(response.tenant)
        setPermissions(ROLE_PERMISSIONS[response.user.role] || [])
        
        // Audit log the login
        await apiService.logAuditEvent({
          action: 'SSO_LOGIN',
          userId: response.user.id,
          tenantId: response.tenant.id,
          provider: provider,
          metadata: { loginTime: new Date().toISOString() }
        })
        
        return { success: true }
      }
      
      return { success: false, error: response.error }
    } catch (error) {
      console.error('SSO login failed:', error)
      return { success: false, error: 'Authentication failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Traditional login with MFA
  const loginWithCredentials = async (email, password, mfaCode = null) => {
    try {
      setIsLoading(true)
      const response = await apiService.enterpriseLogin({
        email,
        password,
        mfaCode,
        tenantDomain: extractTenantFromEmail(email)
      })
      
      if (response.success) {
        if (response.requiresMFA && !mfaCode) {
          return { success: false, requiresMFA: true, mfaMethod: response.mfaMethod }
        }
        
        localStorage.setItem('enterprise_token', response.token)
        setUser(response.user)
        setTenant(response.tenant)
        setPermissions(ROLE_PERMISSIONS[response.user.role] || [])
        
        await apiService.logAuditEvent({
          action: 'LOGIN',
          userId: response.user.id,
          tenantId: response.tenant.id,
          metadata: { loginTime: new Date().toISOString() }
        })
        
        return { success: true }
      }
      
      return { success: false, error: response.error }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Authentication failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      if (user) {
        await apiService.logAuditEvent({
          action: 'LOGOUT',
          userId: user.id,
          tenantId: tenant?.id,
          metadata: { logoutTime: new Date().toISOString() }
        })
      }
      
      localStorage.removeItem('enterprise_token')
      setUser(null)
      setTenant(null)
      setPermissions([])
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Permission checking
  const hasPermission = (permission) => {
    return permissions.includes(permission)
  }

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission))
  }

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission))
  }

  // Role checking
  const hasRole = (role) => {
    return user?.role === role
  }

  const isAdmin = () => {
    return hasRole(ROLES.SUPER_ADMIN) || hasRole(ROLES.TENANT_ADMIN)
  }

  // Tenant isolation
  const getCurrentTenant = () => tenant

  const switchTenant = async (tenantId) => {
    try {
      if (!hasPermission(PERMISSIONS.MANAGE_TENANTS)) {
        throw new Error('Insufficient permissions to switch tenants')
      }
      
      const response = await apiService.switchTenant(tenantId)
      if (response.success) {
        setTenant(response.tenant)
        await apiService.logAuditEvent({
          action: 'TENANT_SWITCH',
          userId: user.id,
          tenantId: tenantId,
          metadata: { previousTenant: tenant?.id, newTenant: tenantId }
        })
      }
      return response
    } catch (error) {
      console.error('Tenant switch failed:', error)
      return { success: false, error: error.message }
    }
  }

  // Helper functions
  const extractTenantFromEmail = (email) => {
    const domain = email.split('@')[1]
    return domain?.split('.')[0] // Extract subdomain as tenant identifier
  }

  const contextValue = {
    // State
    user,
    tenant,
    isLoading,
    permissions,
    
    // Authentication methods
    loginWithSSO,
    loginWithCredentials,
    logout,
    
    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role checking
    hasRole,
    isAdmin,
    
    // Tenant management
    getCurrentTenant,
    switchTenant,
    
    // Constants
    ROLES,
    PERMISSIONS
  }

  return (
    <EnterpriseAuthContext.Provider value={contextValue}>
      {children}
    </EnterpriseAuthContext.Provider>
  )
}

// SSO Login Component
export const SSOLogin = ({ onSuccess, onError }) => {
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [credentials, setCredentials] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithSSO } = useEnterpriseAuth()

  const ssoProviders = [
    {
      id: 'azure',
      name: 'Microsoft Azure AD',
      icon: '🔷',
      color: '#0078d4'
    },
    {
      id: 'okta',
      name: 'Okta',
      icon: '🔵',
      color: '#007dc1'
    },
    {
      id: 'google',
      name: 'Google Workspace',
      icon: '🔴',
      color: '#4285f4'
    },
    {
      id: 'saml',
      name: 'SAML 2.0',
      icon: '🔐',
      color: '#6b7280'
    }
  ]

  const handleSSOLogin = async (provider) => {
    setIsLoading(true)
    try {
      const result = await loginWithSSO(provider, credentials)
      if (result.success) {
        onSuccess?.(result)
      } else {
        onError?.(result.error)
      }
    } catch (error) {
      onError?.(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sso-login-container">
      <div className="sso-header">
        <h3>🏢 Enterprise Single Sign-On</h3>
        <p>Sign in with your organization's identity provider</p>
      </div>
      
      <div className="sso-providers">
        {ssoProviders.map(provider => (
          <button
            key={provider.id}
            className="sso-provider-btn"
            style={{ borderColor: provider.color }}
            onClick={() => handleSSOLogin(provider.id)}
            disabled={isLoading}
          >
            <span className="provider-icon">{provider.icon}</span>
            <span className="provider-name">{provider.name}</span>
            {isLoading && <div className="loading-spinner-sm"></div>}
          </button>
        ))}
      </div>
      
      <div className="sso-divider">
        <span>or</span>
      </div>
      
      <div className="manual-sso">
        <input
          type="text"
          placeholder="Organization domain (e.g., company.com)"
          onChange={(e) => setCredentials({ ...credentials, domain: e.target.value })}
          className="form-input"
        />
        <button
          className="btn btn-secondary"
          onClick={() => handleSSOLogin('manual')}
          disabled={isLoading || !credentials.domain}
        >
          Continue with Domain
        </button>
      </div>
    </div>
  )
}

// Role-Based Component Wrapper
export const RoleGuard = ({ children, requiredRole, requiredPermissions = [], fallback = null }) => {
  const { hasRole, hasAllPermissions, user } = useEnterpriseAuth()
  
  if (!user) {
    return fallback || <div className="access-denied">Please log in to access this content.</div>
  }
  
  const hasRequiredRole = requiredRole ? hasRole(requiredRole) : true
  const hasRequiredPermissions = requiredPermissions.length > 0 ? hasAllPermissions(requiredPermissions) : true
  
  if (!hasRequiredRole || !hasRequiredPermissions) {
    return fallback || (
      <div className="access-denied">
        <div className="access-denied-icon">🚫</div>
        <h3>Access Denied</h3>
        <p>You don't have sufficient permissions to access this content.</p>
        <p>Required: {requiredRole && `Role: ${requiredRole}`} {requiredPermissions.length > 0 && `Permissions: ${requiredPermissions.join(', ')}`}</p>
      </div>
    )
  }
  
  return children
}

// Multi-Tenant Selector
export const TenantSelector = () => {
  const { user, tenant, switchTenant, hasPermission, PERMISSIONS } = useEnterpriseAuth()
  const [availableTenants, setAvailableTenants] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (hasPermission(PERMISSIONS.MANAGE_TENANTS)) {
      loadAvailableTenants()
    }
  }, [hasPermission])

  const loadAvailableTenants = async () => {
    try {
      const tenants = await apiService.getAvailableTenants()
      setAvailableTenants(tenants)
    } catch (error) {
      console.error('Failed to load tenants:', error)
    }
  }

  const handleTenantSwitch = async (tenantId) => {
    setIsLoading(true)
    try {
      await switchTenant(tenantId)
    } catch (error) {
      console.error('Tenant switch failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasPermission(PERMISSIONS.MANAGE_TENANTS) || availableTenants.length <= 1) {
    return null
  }

  return (
    <div className="tenant-selector">
      <label>Organization:</label>
      <select
        value={tenant?.id || ''}
        onChange={(e) => handleTenantSwitch(e.target.value)}
        disabled={isLoading}
        className="tenant-select"
      >
        {availableTenants.map(t => (
          <option key={t.id} value={t.id}>
            {t.name} {t.id === tenant?.id && '(Current)'}
          </option>
        ))}
      </select>
    </div>
  )
}

export default {
  EnterpriseAuthProvider,
  useEnterpriseAuth,
  SSOLogin,
  RoleGuard,
  TenantSelector,
  ROLES,
  PERMISSIONS
}