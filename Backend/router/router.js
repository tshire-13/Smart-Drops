import express from 'express'
const router = express.Router()
import { submitForm } from '../controller/user'

router.post('/submit', submitForm)

export default router