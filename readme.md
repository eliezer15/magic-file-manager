## Magic File Manager

### Overview
Simple web application to handle file uploads and downloads, with a RESTful Json API backend. App can be accessed at http://magic-file-manager.eliezerencarnacion.com

The application has the following endpoints:
* **GET /** : returns the index.html page
* **POST /api/files**: receives upload of a single file in multipart/form-data format, and creates a new file in the system
* **GET /api/files**: returns Json metadata for all files in the system
* **GET /api/files/:id**: returns Json metadata for the file with the provided :id
* **GET /api/files/:id/download**: downloads the file with the provided :id

#### Assumptions made
Decided to support the upload of duplicate files, which are considered different objects with different identifiers by the system.

The app supports requests of up to 100MB in size, thus the size of a file to upload is limited.

### Additional Requirements chosen
* Endpoint to return list of all files in the system
* Web/page for using upload and download endpoints
* Automation infrastructure to deploy a new version of the app in a command* *(see more below)*

### Architectural Decisions
#### Backend Language/Framework: Node.js w/ Express.js
C#/ASP.NET is the technology I am the most comfortable with, but I am familiar enough with Javascript and Node to use it for
this assignment. I used Express.js as the web framework. The application boilerplate was generated using the 
express-generator package.

#### Frontend Language/Frameworks: Handlebars, jQuery, Bulma
Used Handlebars as the template engine, though there isn't any dynamic template generation in the app, everything is fetched from
the backend via AJAX. Used jQuery as the frontend framework, due to its simplicity and my familiarity with it. Used Bulma to 
add a bit of style to the page.

#### Object and Metadata Storage: Amazon S3, Amazon DynamoDB
Use S3 to store the file objects. Decided to use DynamoDB as the database to store file metadata like id, file size, etc.

#### Deployment infrastructure: Amazon Elastic Beanstalk
Used Elastic Beanstalk to simplify the deployment of the application. Under the covers, EB deploys the application to an EC2 Linux
instance with ngnix as a proxy.

### Running and Deploying the app
#### Running app locally
**Prerequisites**:
* Node.js version 7.6 and above (support of async/await)
* A way to authenticate with an AWS account; by default the app will look for a shared credentials file. The selected profile
must have full S3 access and full DynamoDB access
* An S3 bucket must be already created for the application. The name of the bucket can be set on config/config.js
* A DynamoDB table must be already created, with a partition key of type string and field name "Id". The name of the table can be set
on config/config.js

To run the app locally, open a terminal and run `npm start`

#### Deploying the app
A new version of the app can be deployed using the Elastic Beanstalk CLI tool. After making and committing all changes to git,
open a terminal and run `eb deploy` to deploy the new version of the application. The limitation with the deployment is that it
does not handle creation of the required infrastructure; the S3 bucket, dynamo table, relevant IAM roles, and Elastic Beanstalk
application and environments must already be set in place for the deployment to work correctly.
