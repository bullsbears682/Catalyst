// Bulletproof Form Validation System
import { roiCategories, roiScenarios } from '../data/roiData.js'

// Input validation that never fails
export const validateInputs = (investment, selectedCategory, selectedScenario, specificScenario = null) => {
  const errors = []
  const warnings = []

  // Investment validation with comprehensive checks
  if (!investment) {
    errors.push('Investment amount is required')
  } else {
    const numInvestment = Number(investment)
    
    if (isNaN(numInvestment)) {
      errors.push('Investment must be a valid number')
    } else if (numInvestment < 1000) {
      errors.push('Investment must be at least $1,000')
    } else if (numInvestment > 100000000) {
      errors.push('Investment cannot exceed $100,000,000')
    } else if (numInvestment < 10000) {
      warnings.push('Small investments may have limited ROI accuracy')
    } else if (numInvestment > 10000000) {
      warnings.push('Large investments may require custom analysis')
    }
  }

  // Category validation
  if (!selectedCategory) {
    errors.push('Please select a valid category')
  } else if (!roiCategories[selectedCategory]) {
    errors.push('Selected category is not available')
  }

  // Scenario validation
  if (!selectedScenario) {
    errors.push('Please select a valid scenario')
  } else if (!roiScenarios[selectedScenario]) {
    errors.push('Selected scenario is not available')
  }

  // Specific scenario validation (for detailed calculations)
  if (selectedCategory && specificScenario) {
    const categoryData = roiCategories[selectedCategory]
    if (categoryData && !categoryData.scenarios[specificScenario]) {
      errors.push('Selected specific scenario is not available for this category')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasWarnings: warnings.length > 0
  }
}

// Email validation for lead capture
export const validateEmail = (email) => {
  const errors = []
  
  if (!email) {
    errors.push('Email address is required')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address')
    } else if (email.length > 254) {
      errors.push('Email address is too long')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Phone validation
export const validatePhone = (phone) => {
  const errors = []
  
  if (phone) {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '')
    
    if (cleanPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits')
    } else if (cleanPhone.length > 15) {
      errors.push('Phone number is too long')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Company name validation
export const validateCompany = (company) => {
  const errors = []
  
  if (!company) {
    errors.push('Company name is required')
  } else if (company.length < 2) {
    errors.push('Company name must be at least 2 characters')
  } else if (company.length > 100) {
    errors.push('Company name is too long')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  const errors = []
  
  if (!name) {
    errors.push(`${fieldName} is required`)
  } else if (name.length < 2) {
    errors.push(`${fieldName} must be at least 2 characters`)
  } else if (name.length > 50) {
    errors.push(`${fieldName} is too long`)
  } else if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Message validation
export const validateMessage = (message) => {
  const errors = []
  
  if (message && message.length > 1000) {
    errors.push('Message is too long (maximum 1000 characters)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Comprehensive lead form validation
export const validateLeadForm = (formData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    message,
    consent
  } = formData

  const allErrors = []
  const allWarnings = []

  // Validate each field
  const firstNameValidation = validateName(firstName, 'First name')
  const lastNameValidation = validateName(lastName, 'Last name')
  const emailValidation = validateEmail(email)
  const phoneValidation = validatePhone(phone)
  const companyValidation = validateCompany(company)
  const messageValidation = validateMessage(message)

  // Collect all errors
  allErrors.push(...firstNameValidation.errors)
  allErrors.push(...lastNameValidation.errors)
  allErrors.push(...emailValidation.errors)
  allErrors.push(...phoneValidation.errors)
  allErrors.push(...companyValidation.errors)
  allErrors.push(...messageValidation.errors)

  // Consent validation
  if (!consent) {
    allErrors.push('You must agree to the privacy policy to continue')
  }

  // Add warnings for optional but recommended fields
  if (!phone) {
    allWarnings.push('Phone number is recommended for faster follow-up')
  }
  
  if (!message) {
    allWarnings.push('A message helps us better understand your needs')
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    hasWarnings: allWarnings.length > 0
  }
}

// Admin login validation
export const validateAdminLogin = (password) => {
  const errors = []
  
  if (!password) {
    errors.push('Password is required')
  } else if (password !== 'CatalystROI2025') {
    errors.push('Invalid admin password')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Currency validation
export const validateCurrency = (currency, availableCurrencies) => {
  const errors = []
  
  if (!currency) {
    errors.push('Currency is required')
  } else if (!availableCurrencies[currency]) {
    errors.push('Selected currency is not supported')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, '')
}

// Format and validate investment amount
export const formatInvestment = (value) => {
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '')
  
  // Handle multiple decimal points
  const parts = cleanValue.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit decimal places to 2
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2)
  }
  
  const formattedValue = parts.join('.')
  const numValue = parseFloat(formattedValue)
  
  // Return null if invalid number
  if (isNaN(numValue)) return ''
  
  return formattedValue
}

// Real-time validation for better UX
export const validateFieldRealTime = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case 'investment':
      return validateInputs(value, formData.category, formData.scenario)
    case 'email':
      return validateEmail(value)
    case 'phone':
      return validatePhone(value)
    case 'firstName':
      return validateName(value, 'First name')
    case 'lastName':
      return validateName(value, 'Last name')
    case 'company':
      return validateCompany(value)
    case 'message':
      return validateMessage(value)
    default:
      return { isValid: true, errors: [], warnings: [] }
  }
}

export default {
  validateInputs,
  validateEmail,
  validatePhone,
  validateCompany,
  validateName,
  validateMessage,
  validateLeadForm,
  validateAdminLogin,
  validateCurrency,
  sanitizeInput,
  formatInvestment,
  validateFieldRealTime
}