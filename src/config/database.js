
import dotenv from 'dotenv'
dotenv.config()

const dbDSN = process.env.DB_DSN || 'mongodb'
const dbHost = process.env.DB_HOST || 'localhost'
const dbUsername = process.env.DB_USERNAME || ''
const dbPassword = process.env.DB_PASSWORD || ''
const dbName = process.env.DB_DATABASE || ''

const connectionString = `${dbDSN}://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`

export { connectionString }