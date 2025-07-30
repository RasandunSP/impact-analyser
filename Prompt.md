# This system is a impact analyser where you can upload a set of multiple ER diagrams or related diagrams and get a analysis on which areas will be affected by incoming changes to the system, 

# so that the changes will be identified with a comparison between the previously uploaded ER or any given set of diagrams and with uploading text containing new change request to the system

## system should have

### simple 1 ui
#### select relevent system architecture  from dropdown (Cleint server/ Monolithic/ micro services)
#### select the Server details (Should be able to add server instances with it's RAM, OS, Disk, Type confirablly)
#### upload 1-20 diagrams - pdf mode or using text (if text - mermaid chart code)
#### Upload the change request - via a pdf/txt file upload or a log paragraph  text upload. 

#### should be able to save present to the logged in account (meaning all the uploaded files, system configs mentioned, due change requests noted and saved in the user account)

#the system should be built using shadcn library in next js