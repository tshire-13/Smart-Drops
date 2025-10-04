import express from 'express'
export const app = express()
import 'dotenv/config'
import router from './router/router.js'
import cors from 'cors'
const PORT = process.env.PORT || 1000


app.use(cors())
app.use(express.json())
app.use('/api', router)

app.listen(PORT, ()=> console.log(`server started on port http://localhost:${PORT}`))