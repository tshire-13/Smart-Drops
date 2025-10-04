import express from 'express'
const router = express.Router()
import { submitForm, upload, uploadImage } from '../controller/user.js'

router.post('/submit',submitForm)
router.post('/upload', upload.single("image"),uploadImage)


export default router