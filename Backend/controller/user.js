import {app} from '../utils/firebase.js'
import { doc, setDoc, collection, getFirestore, getDocs, getDoc } from 'firebase/firestore'
import AWS from "aws-sdk";
import multer from "multer"
import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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
     const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Date.now() + "-" + req.file.originalname, // unique file name
      Body: req.file.buffer,
      ContentType: req.file.mimetype,}

      await s3.upload(params).promise()

     image_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;


        const docRef = doc(db, "users", timestamp)
        await setDoc(docRef, {
            name, email, number, location_description,
            severity, description, latitude, image_url,
            longitude, timestamp
        })

        await setDoc(doc(db, "municipalities", timestamp), {
            name: municipality,
            email: Memail,
            phone: Mnumber
        }, {merge: true})

          const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: Memail,
             subject: `[ALERT] Leak detected — ${severity || "unknown"}`,
            html:`
            <h2 style="color:#c62828">Leak Detected</h2>
            <p><b>Location:</b> ${location || "unknown"}</p>
            <p><b>Severity:</b> ${severity || "unknown"}</p>
            <p><b>Time:</b> ${time}</p>
            <p><b>Details:</b> ${details || "N/A"}</p>
      `
        })
        if (error) {
          console.error('Error sending email:', error);
        }


       res.status(200).json({message: "Form submitted successfully"})

    }catch(err){
        return res.status(500).json({message: "Server error"})
    }
}

export const getData = async(req,res)=> {
  console.log("get data called")
    const db = getFirestore(app)
    const querySnapshot_Min = await getDocs(collection(db, "municipalities"))
    const querySnapshot_Users = await getDocs(collection(db, "users"))
   try{
     const municipalities = querySnapshot_Min.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
    const users = querySnapshot_Users.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) 
  
  const joinedData = users
    .filter((user) =>
      municipalities.some((mun) => mun.id === user.timestamp)
    )
    .map((user) => {
      const municipality = municipalities.find(
        (mun) => mun.id === user.timestamp
      )
      return {
        name: user.name,
        location_description: user.location_description,
        severity: user.severity,
        timestamp: user.timestamp,
      }
    })
    return res.status(200).json(joinedData)
   }catch(err){
    return res.status(500).json({message: "Server error "+ err})
   }
    
}

export const getSingleData = async(req,res)=> {
    const db = getFirestore(app)
    const {id} = req.params
    try{
        const docRef = doc(db, "users", id)
        const docSnap = await getDoc(docRef)
        if(!docSnap.exists()){
            return res.status(404).json({message: "Data not found"})
        }
        return res.status(200).json(docSnap.data())
    }catch(err){
        return res.status(500).json({message: "Server error " + err})
    }
}
