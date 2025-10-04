import {app} from '../utils/firebase.js'
import { doc, setDoc, updateDoc, arrayUnion, getFirestore, getDoc } from 'firebase/firestore'
import AWS from "aws-sdk";
import multer from "multer";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const upload = multer({ storage: multer.memoryStorage() })



export const submitForm  = async(req,res)=> {

    const db = getFirestore(app)
    const now = new Date();
    const timestamp = now.toISOString();

    const {name, email, number, location_description, 
        severity, description, image_url, latitude, longitude, 
        municipality, Memail, Mnumber
    } = req.body


    if(!name || !email || !number || !location_description || !severity || !description || !image_url || !latitude || !longitude){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const docRef = doc(db, "users", timestamp)
        await setDoc(docRef, {
            name, email, number, location_description,
            severity, description, latitude,
            longitude, timestamp
        })

        await setDoc(doc(db, "municipalities", timestamp), {
            name: municipality,
            email: Memail,
            phone: Mnumber
        }, {merge: true})

       res.status(200).json({message: "Form submitted successfully"})

    }catch(err){
        return res.status(500).json({message: "Server error"})
    }
}

export const uploadImage  = async(req,res)=> {
    try{
        console.log(process.env.AWS_BUCKET_NAME)
          const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Date.now() + "-" + req.file.originalname, // unique file name
      Body: req.file.buffer,
      ContentType: req.file.mimetype,}

      await s3.upload(params).promise()
      
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;


         res.status(200).json({image_url: imageUrl})
    }catch(err){
        return res.status(500).json({message: "Server error" + err.message})
    }
}