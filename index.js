const express = require('express');
const path = require('path');
const app = express();
const port = 3000; // You can use any port number you prefer

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/private', express.static(path.join(__dirname, 'private')));
// app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Route to render pages based on query parameters
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
