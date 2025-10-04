import express from 'express'
const router = express.Router()
import { submitForm, upload } from '../controller/user.js'

router.post('/submit', upload.single("image"),submitForm)


export default router