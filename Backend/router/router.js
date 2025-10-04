import express from 'express'
const router = express.Router()
import { submitForm, upload, getData } from '../controller/user.js'

router.post('/submit', upload.single("image"),submitForm)
router.get('/data', getData)


export default router