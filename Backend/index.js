import express from 'express'
export const app = express()
import 'dotenv/config'
import router from './routes/router.js'

const PORT = process.env.PORT || 1000

app.use(express.json())
app.use('/api', router)

app.listen(PORT, ()=> console.log(`server started on port http://localhost:${PORT}`))