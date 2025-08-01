// Database Module - SQLite with automatic table creation
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../data/roi_calculator.db')

let db = null

// Initialize database connection and create tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Database connection error:', err)
        reject(err)
        return
      }
      
      console.log('Connected to SQLite database')
      createTables().then(resolve).catch(reject)
    })
  })
}

// Create database tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    const createLeadsTable = `
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT NOT NULL,
        message TEXT,
        roiData TEXT,
        source TEXT DEFAULT 'calculator',
        ipAddress TEXT,
        userAgent TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createCalculationsTable = `
      CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        investment REAL NOT NULL,
        category TEXT NOT NULL,
        scenario TEXT NOT NULL,
        specificScenario TEXT,
        currency TEXT DEFAULT 'USD',
        roiResult TEXT,
        ipAddress TEXT,
        userAgent TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createAnalyticsTable = `
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event TEXT NOT NULL,
        data TEXT,
        ipAddress TEXT,
        userAgent TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(createdAt);
      CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(createdAt);
      CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(createdAt);
    `

    db.exec(createLeadsTable, (err) => {
      if (err) {
        reject(err)
        return
      }

      db.exec(createCalculationsTable, (err) => {
        if (err) {
          reject(err)
          return
        }

        db.exec(createAnalyticsTable, (err) => {
          if (err) {
            reject(err)
            return
          }

          db.exec(createIndexes, (err) => {
            if (err) {
              reject(err)
              return
            }

            console.log('Database tables created successfully')
            resolve()
          })
        })
      })
    })
  })
}

// Insert a new lead
const insertLead = (leadData) => {
  return new Promise((resolve, reject) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      roiData,
      source,
      ipAddress,
      userAgent
    } = leadData

    const sql = `
      INSERT INTO leads (
        firstName, lastName, email, phone, company, 
        message, roiData, source, ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.run(sql, [
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      roiData,
      source,
      ipAddress,
      userAgent
    ], function(err) {
      if (err) {
        console.error('Insert lead error:', err)
        reject(err)
        return
      }
      
      console.log(`Lead inserted with ID: ${this.lastID}`)
      resolve(this.lastID)
    })
  })
}

// Get leads with pagination and filtering
const getLeads = (options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      page = 1,
      limit = 50,
      search = '',
      dateFrom,
      dateTo
    } = options

    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    let params = []

    // Add search filter
    if (search) {
      whereClause += ` AND (
        firstName LIKE ? OR 
        lastName LIKE ? OR 
        email LIKE ? OR 
        company LIKE ?
      )`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    // Add date filters
    if (dateFrom) {
      whereClause += ' AND createdAt >= ?'
      params.push(dateFrom)
    }

    if (dateTo) {
      whereClause += ' AND createdAt <= ?'
      params.push(dateTo)
    }

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM leads ${whereClause}`
    
    db.get(countSql, params, (err, countResult) => {
      if (err) {
        reject(err)
        return
      }

      // Get paginated results
      const dataSql = `
        SELECT 
          id, firstName, lastName, email, phone, company, 
          message, roiData, source, createdAt
        FROM leads 
        ${whereClause}
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `

      db.all(dataSql, [...params, limit, offset], (err, rows) => {
        if (err) {
          reject(err)
          return
        }

        resolve({
          leads: rows.map(row => ({
            ...row,
            roiData: row.roiData ? JSON.parse(row.roiData) : null
          })),
          pagination: {
            page,
            limit,
            total: countResult.total,
            pages: Math.ceil(countResult.total / limit)
          }
        })
      })
    })
  })
}

// Insert calculation record
const insertCalculation = (calculationData) => {
  return new Promise((resolve, reject) => {
    const {
      investment,
      category,
      scenario,
      specificScenario,
      currency,
      roiResult,
      ipAddress,
      userAgent
    } = calculationData

    const sql = `
      INSERT INTO calculations (
        investment, category, scenario, specificScenario,
        currency, roiResult, ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.run(sql, [
      investment,
      category,
      scenario,
      specificScenario,
      currency,
      JSON.stringify(roiResult),
      ipAddress,
      userAgent
    ], function(err) {
      if (err) {
        console.error('Insert calculation error:', err)
        reject(err)
        return
      }
      
      resolve(this.lastID)
    })
  })
}

// Get analytics data
const getAnalytics = (period = '30d') => {
  return new Promise((resolve, reject) => {
    const days = parseInt(period.replace('d', ''))
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)
    
    const queries = {
      // Total leads
      totalLeads: `
        SELECT COUNT(*) as count 
        FROM leads 
        WHERE createdAt >= ?
      `,
      
      // Total calculations
      totalCalculations: `
        SELECT COUNT(*) as count 
        FROM calculations 
        WHERE createdAt >= ?
      `,
      
      // Leads by day
      leadsByDay: `
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM leads 
        WHERE createdAt >= ?
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `,
      
      // Calculations by category
      calculationsByCategory: `
        SELECT 
          category,
          COUNT(*) as count
        FROM calculations 
        WHERE createdAt >= ?
        GROUP BY category
        ORDER BY count DESC
      `,
      
      // Top companies
      topCompanies: `
        SELECT 
          company,
          COUNT(*) as count
        FROM leads 
        WHERE createdAt >= ?
        GROUP BY company
        ORDER BY count DESC
        LIMIT 10
      `,
      
      // Average investment
      averageInvestment: `
        SELECT 
          AVG(investment) as average,
          MIN(investment) as minimum,
          MAX(investment) as maximum
        FROM calculations 
        WHERE createdAt >= ?
      `
    }

    const results = {}
    const promises = Object.entries(queries).map(([key, sql]) => {
      return new Promise((resolve, reject) => {
        if (key === 'totalLeads' || key === 'totalCalculations') {
          db.get(sql, [dateFrom.toISOString()], (err, row) => {
            if (err) reject(err)
            else {
              results[key] = row.count
              resolve()
            }
          })
        } else {
          db.all(sql, [dateFrom.toISOString()], (err, rows) => {
            if (err) reject(err)
            else {
              results[key] = rows
              resolve()
            }
          })
        }
      })
    })

    Promise.all(promises)
      .then(() => {
        resolve({
          period,
          dateFrom: dateFrom.toISOString(),
          ...results
        })
      })
      .catch(reject)
  })
}

// Insert analytics event
const insertAnalyticsEvent = (event, data = null, ipAddress = null, userAgent = null) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO analytics (event, data, ipAddress, userAgent)
      VALUES (?, ?, ?, ?)
    `

    db.run(sql, [
      event,
      data ? JSON.stringify(data) : null,
      ipAddress,
      userAgent
    ], function(err) {
      if (err) {
        console.error('Insert analytics error:', err)
        reject(err)
        return
      }
      
      resolve(this.lastID)
    })
  })
}

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err)
          return
        }
        console.log('Database connection closed')
        resolve()
      })
    } else {
      resolve()
    }
  })
}

module.exports = {
  initDatabase,
  insertLead,
  getLeads,
  insertCalculation,
  getAnalytics,
  insertAnalyticsEvent,
  closeDatabase
}