import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from multiple possible locations
dotenv.config({ path: join(__dirname, 'Supsbsase', '.env') })
dotenv.config({ path: join(__dirname, '.env') })
dotenv.config()

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.REACT_APP_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please check your environment variables.')
}

// Create Supabase client with service role key for admin operations
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
}) : null

// Create Supabase client with anon key for regular operations
export const supabase = supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
}) : null

// Database service functions
export const dbService = {
  /**
   * Execute raw SQL query (admin only)
   * @param {string} query - SQL query to execute
   * @param {Array} params - Query parameters
   */
  async executeQuery(query, params = []) {
    if (!supabaseAdmin) {
      throw new Error('Admin client not available. Missing service role key.')
    }
    
    try {
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        sql_query: query,
        params: params
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Database query error:', error)
      return { data: null, error }
    }
  },

  /**
   * Get table data with optional filters
   * @param {string} table - Table name
   * @param {Object} options - Query options
   */
  async getTable(table, options = {}) {
    const client = options.useAdmin ? supabaseAdmin : supabase
    if (!client) {
      throw new Error('Supabase client not available.')
    }

    try {
      let query = client.from(table).select(options.select || '*')
      
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false })
      }
      
      if (options.limit) {
        query = query.limit(options.limit)
      }
      
      const { data, error } = await query
      return { data, error }
    } catch (error) {
      console.error(`Error fetching ${table}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Insert data into table
   * @param {string} table - Table name
   * @param {Object|Array} data - Data to insert
   */
  async insert(table, data) {
    const client = supabaseAdmin || supabase
    if (!client) {
      throw new Error('Supabase client not available.')
    }

    try {
      const { data: result, error } = await client
        .from(table)
        .insert(data)
        .select()
      
      return { data: result, error }
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Update data in table
   * @param {string} table - Table name
   * @param {Object} updates - Data to update
   * @param {Object} filters - Where conditions
   */
  async update(table, updates, filters) {
    const client = supabaseAdmin || supabase
    if (!client) {
      throw new Error('Supabase client not available.')
    }

    try {
      let query = client.from(table).update(updates)
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query.select()
      return { data, error }
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      return { data: null, error }
    }
  },

  /**
   * Delete data from table
   * @param {string} table - Table name
   * @param {Object} filters - Where conditions
   */
  async delete(table, filters) {
    const client = supabaseAdmin || supabase
    if (!client) {
      throw new Error('Supabase client not available.')
    }

    try {
      let query = client.from(table).delete()
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query
      return { data, error }
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error)
      return { data: null, error }
    }
  }
}

// Authentication service functions
export const authService = {
  /**
   * Create a new user (admin only)
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Additional user data
   */
  async createUser(email, password, metadata = {}) {
    if (!supabaseAdmin) {
      throw new Error('Admin client required for user creation')
    }

    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata
      })
      
      return { data, error }
    } catch (error) {
      console.error('Error creating user:', error)
      return { data: null, error }
    }
  },

  /**
   * Update user (admin only)
   * @param {string} userId - User ID
   * @param {Object} updates - User updates
   */
  async updateUser(userId, updates) {
    if (!supabaseAdmin) {
      throw new Error('Admin client required for user updates')
    }

    try {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, updates)
      return { data, error }
    } catch (error) {
      console.error('Error updating user:', error)
      return { data: null, error }
    }
  },

  /**
   * Delete user (admin only)
   * @param {string} userId - User ID
   */
  async deleteUser(userId) {
    if (!supabaseAdmin) {
      throw new Error('Admin client required for user deletion')
    }

    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
      return { data, error }
    } catch (error) {
      console.error('Error deleting user:', error)
      return { data: null, error }
    }
  }
}

// Export configuration for debugging
export const config = {
  supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  hasAnonKey: !!supabaseAnonKey,
  adminClientAvailable: !!supabaseAdmin,
  publicClientAvailable: !!supabase
}

console.log('Supabase Backend Configuration:')
console.log('- URL:', supabaseUrl || 'Not configured')
console.log('- Service Key:', supabaseServiceKey ? 'Configured' : 'Missing')
console.log('- Anon Key:', supabaseAnonKey ? 'Configured' : 'Missing')
console.log('- Admin Client:', supabaseAdmin ? 'Available' : 'Not available')
console.log('- Public Client:', supabase ? 'Available' : 'Not available')