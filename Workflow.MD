# SMART DROP WORKFLOW 
#### Description :
A community-driven platform that lets South Africans report water leaks in real time using photos and GPS. Reports are mapped and aggregated into a dashboard for municipalities, highlighting leak hotspots and helping reduce water loss along with dataset obtained from NASA. In future we plan to use IOT(Internet of Things) technology by installing water sensors on pipelines to continuously monitor water pressure. A sudden drop in pressure would indicate a potential leak, allowing us to detect and address issues proactively

#### Combining rainfall data with leak data helps:
- Prioritize leak repairs where water is naturally scarce
- Provide environmental context to decision-makers
- Build a data-driven, resource-aware water management strategy

#### How NASA GPM Data Helps
NASA’s GPM (Global Precipitation Measurement) provides near real-time global rainfall estimates from space.
#### Use GPM data to:
- Track rainfall amounts (daily/monthly/yearly) across all SA municipalities
- Identify areas with:
- Very low rainfall (water scarce)
- Irregular rainfall patterns (risk of drought or water insecurity)
##### Overlay these zones on your leak report map to highlight:
- High leak density + low rainfall = critical zone
- Low leak density + high rainfall = lower priority

### 1. Workflow
- User submits a form 
- Save it to database and images to AWS S3 bucket
- Automatically send an email to relevent municipality via a script running on an AWS EC2 Instance
- The municipality can login to the website and see how many leaks are reported so they can be addressed

### 2. Fields to save on database
1. #### User form
##### Field Name--------------------- Type ------------------------------Description
- reporter_name-------------------String -----------------------------Name of the person reporting
- reporter_contact----------------String ----------------------------Email or phone number(for follow-up)
- latitude------------------------Float -------------------------------GPS latitude from device
- longitude-------------------------Float --------------------------------GPS longitude from device
- Field Name------------------------Type----------------------------------Description	
- reporter_name--------------------String--------------------------------Name of the person reporting
- location_description------------String---------------------------------Nearby landmark or address
- severity------------------------Enum----------------------------------e.g. Low / Medium / High
- description------------------String------------------------------------Text field with more details
image_url	String	Link to uploaded image on S3
timestamp	DateTime	When the report was submitted
municipality_id	String	Foreign key from municipality table


# Overall Picture 
### 1. Workflow
- User submits a form 
- Save it to database and images to AWS S3 bucket
- Automatically send an email to relevent municipality via a script running on an AWS EC2 Instance
- The municipality can login to the website and see how many leaks are reported so they can be addressed
- The municipality can mark reports as fixed and they can be removed from the database