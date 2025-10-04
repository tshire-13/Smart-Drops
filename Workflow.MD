# SMART DROP WORKFLOW 
#### Description :
A community-driven platform that lets South Africans report water leaks in real time using photos and GPS. Reports are mapped and aggregated into a dashboard for municipalities, highlighting leak hotspots and helping reduce water loss. In future we plan to use IOT(Internet of Things) technology by installing water sensors on pipelines to continuously monitor water pressure. A sudden drop in pressure would indicate a potential leak, allowing us to detect and address issues proactively

### 1. Workflow
- User submits a form 
- Save it to database and images to AWS S3 bucket
- Automatically send an email to relevent municipality via a script running on an AWS EC2 Instance
- The municipality can login to the website and see how many leaks are reported so they can be addressed


# Overall Picture 
### 1. Workflow
- User submits a form 
- Save it to database and images to AWS S3 bucket
- Automatically send an email to relevent municipality via a script running on an AWS EC2 Instance
- The municipality can login to the website and see how many leaks are reported so they can be addressed
- The municipality can mark reports as fixed and they can be removed from the database