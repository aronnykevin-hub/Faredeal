import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { supabaseAdmin, supabase, dbService, authService, config } from './supabase.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: [
    'http://localhost:5173', // Frontend dev server
    'http://localhost:5174', // Admin portal
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabase: config,
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: config.supabaseUrl,
    adminAvailable: config.adminClientAvailable,
    publicAvailable: config.publicClientAvailable,
    features: {
      userManagement: config.adminClientAvailable,
      publicData: config.publicClientAvailable,
      databaseOps: config.adminClientAvailable
    }
  })
})

// Database management endpoints (admin only)
app.get('/api/admin/tables/:table', async (req, res) => {
  try {
    const { table } = req.params
    const { limit = 50, orderBy = 'created_at', ascending = false } = req.query
    
    const result = await dbService.getTable(table, {
      useAdmin: true,
      limit: parseInt(limit),
      orderBy,
      ascending: ascending === 'true'
    })
    
    if (result.error) {
      return res.status(400).json({ error: result.error.message })
    }
    
    res.json(result.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// User management endpoints (admin only)
app.post('/api/admin/users', async (req, res) => {
  try {
    const { email, password, metadata } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const result = await authService.createUser(email, password, metadata)
    
    if (result.error) {
      return res.status(400).json({ error: result.error.message })
    }
    
    res.json(result.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Public data endpoints
app.get('/api/products', async (req, res) => {
  try {
    const { category, active = true } = req.query
    const filters = { active: active === 'true' }
    if (category) filters.category = category
    
    const result = await dbService.getTable('products', {
      filters,
      orderBy: 'name',
      ascending: true
    })
    
    if (result.error) {
      return res.status(400).json({ error: result.error.message })
    }
    
    res.json(result.data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FareDeal Backend Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`⚙️  Configuration: http://localhost:${PORT}/api/config`)
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`)
  
  // Log Supabase status
  if (config.adminClientAvailable) {
    console.log('✅ Supabase Admin client ready')
  } else {
    console.log('⚠️  Supabase Admin client not available (missing service role key)')
  }
  
  if (config.publicClientAvailable) {
    console.log('✅ Supabase Public client ready')
  } else {
    console.log('⚠️  Supabase Public client not available (missing anon key)')
  }
})

export default app