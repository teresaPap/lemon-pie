# Lemon Pie 

_Archiving this repository, as it is not being maintained anymore. Feel free to clone and run it locally._

### An Interactive Prototyping Tool
A web tool for creating interactive prototypes by creating links between mockup images. 

Built with Angular 9 and Firebase. 

Created as part of my Bachelor's Thesis. 

## Latest stable environment 
* node v12.16.3
* npm v6.14.4

## Installation
* `git clone https://github.com/teresaPap/lemon-pie.git`
* `cd lemon-pie/`
* `npm install`
* `npm start`

## Run
Open terminal in the project's root folder and run `npm start`. This will automatically run the project in your default browser (port 5200).

## Build
Open terminal in the project's root folder and run `npm run build`. This will create the project's dist folder. 

## Deploy 
### Firebase Hosting 
Open terminal to the project root folder and run 
* `npm run build`
* `firebase deploy --only hosting`

The *dist* folder will be created in the project's root folder and will be deployed to [https://lemonpie-f5dba.firebaseapp.com](https://lemonpie-f5dba.firebaseapp.com).
