import app from '../utils/firebase.js'
import { doc, setDoc, updateDoc, arrayUnion, getFirestore, getDoc } from 'firebase/firestore'

export const submitForm  = async(req,res)=> {

    const db = getFirestore(app)
    const now = new Date();
    const timestamp = now.toISOString();

    const {name, email, number, location_description, 
        severity, description, image_url, latitude, longitude, 
        province, pname, pemail, pnumber
    } = req.body


    if(!name || !email || !number || !location_description || !severity || !description || !image_url || !latitude || !longitude){
        return res.status(400).json({message: "All fields are required"})
    }

    try{
        const docRef = doc(db, "users", timestamp)
        await setDoc(docRef, {
            name, email, number, location_description,
            severity, description, image_url, latitude,
            longitude, timestamp
        })

        await setDoc(doc(db, "municipalities", timestamp), {
            name: province,
            email: pemail,
            contact: pnumber
        }, {merge: true})






    }catch(err){
        return res.status(500).json({message: "Server error"})
    }
}