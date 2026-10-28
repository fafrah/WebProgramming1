// importing node.js built in modules
const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

// storing registered users
const users = [];

// creates web server
const server = http.createServer((req, res) => {

    // gets the requested url without any query parameters
    const requestedUrl = new URL(req.url, "http://localhost").pathname;

    // handles the register form
    if (req.method === "POST" && requestedUrl === "/register") {

        // collects info
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            // converts the form data to an object
            const formData = querystring.parse(body);

            // gets the username, email, and password
            const username = formData.username;
            const email = formData.email;
            const password = formData.password;

            // checks whether all fields have been filled in
            if (!username || !email || !password) {
                res.writeHead(400, { "Content-Type": "text/html" });
                return res.end(`
                    <h1>Registration Failed</h1>
                    <p>Please fill in all fields.</p>
                    <a href="/register.html">Go back to registration</a>
                `);
            }

            // checks whether user exists
            const existingUser = users.find(
                user => user.username === username
            );

            // stops registering if user already exists
            if (existingUser) {
                res.writeHead(200, { "Content-Type": "text/html" });
                return res.end(`
                    <h1>Registration Failed</h1>
                    <p>This username is already registered.</p>
                    <a href="/login.html">Go to login page</a>
                `);
            }

            // saves users info
            users.push({ username, email, password });

            // success message for registering
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
                <h1>You have successfully registered</h1>
                <a href="/login.html">Go to login page</a>
            `);
        });

        return;
    }

    // handles the login form
    else if (req.method === "POST" && requestedUrl === "/login") {

        // collects the login info sent over
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            // takes the submitted info and makes it an object
            const formData = querystring.parse(body);

            // gets the username and password
            const username = formData.username;
            const password = formData.password;

            // looks for a user with a matching username and password
            const foundUser = users.find(
                user =>
                    user.username === username &&
                    user.password === password
            );

            // sends response based on login attempt
            res.writeHead(200, { "Content-Type": "text/html" });

            if (foundUser) {
                res.end(`
                    <h1>You have logged in successfully</h1>
                    <a href="/login.html">Go back to login page</a>
                `);
            } else {
                res.end(`
                    <h1>The login credentials are incorrect</h1>
                    <a href="/login.html">Try logging in again</a>
                `);
            }
        });

        return;
    }

    // displays website pages, css files, and images
    else if (req.method === "GET") {

        // opens the homepage when visiting the website address
        let fileName = requestedUrl;

        if (fileName === "/") {
            fileName = "/index.html";
        }

        // finds the requested file inside the website folder
        const filePath = path.resolve(
            __dirname,
            "." + decodeURIComponent(fileName)
        );

        // prevents access to files outside the website folder
        if (
            filePath !== __dirname &&
            !filePath.startsWith(__dirname + path.sep)
        ) {
            res.writeHead(403, { "Content-Type": "text/html" });
            return res.end("<h1>Access denied</h1>");
        }

        // reads the requested file
        fs.readFile(filePath, (err, data) => {

            // displays a message if the file cannot be found
            if (err) {
                res.writeHead(404, { "Content-Type": "text/html" });
                return res.end(`
                    <h1>Page not found</h1>
                    <a href="/index.html">Return to Ruby's Fragrance</a>
                `);
            }

            // identifies the type of file being opened
            const extension = path.extname(filePath).toLowerCase();

            // sets the content type for the browser
            let contentType = "text/plain";

            if (extension === ".html") {
                contentType = "text/html";
            } else if (extension === ".css") {
                contentType = "text/css";
            } else if (extension === ".js") {
                contentType = "text/javascript";
            } else if (extension === ".jpg" || extension === ".jpeg") {
                contentType = "image/jpeg";
            } else if (extension === ".png") {
                contentType = "image/png";
            } else if (extension === ".gif") {
                contentType = "image/gif";
            } else if (extension === ".svg") {
                contentType = "image/svg+xml";
            } else if (extension === ".webp") {
                contentType = "image/webp";
            } else if (extension === ".ico") {
                contentType = "image/x-icon";
            }

            // sends the requested file to the browser
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        });

        return;
    }

    // displays a message if the request method is not supported
    else {
        res.writeHead(405, { "Content-Type": "text/html" });
        res.end("<h1>Method not allowed</h1>");
    }
});

// server starts at port 3000
server.listen(3000, () => {
    console.log("Ruby's Fragrance is running at http://localhost:3000");
});
