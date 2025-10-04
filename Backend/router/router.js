import express from 'express'
const router = express.Router()
import { submitForm, upload, getData, getSingleData } from '../controller/user.js'

router.post('/submit', upload.single("image"),submitForm)
router.get('/data', getData)
router.get('/data/:id', getSingleData)


export default router