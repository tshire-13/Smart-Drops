

const submitForm  = async(req,res)=> {

    const now = new Date();
    const timestamp = now.toISOString();

    const {name, email, number, location_description, 
        severity, description, image_url, latitude, longitude, 
    } = req.body
}