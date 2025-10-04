import app from '../utils/firebase.js'

const submitForm  = async(req,res)=> {

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

    }catch(err){
        return res.status(500).json({message: "Server error"})
    }
}