// index.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3872;

// In-memory storage for users
let users = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Home</title></head>
      <body>
        <h1>Welcome to GRE Registration (2024-25)</h1>
        <a href="/register">Register</a> | <a href="/login">Login</a>
      </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
    <html>
      <head><title>Login</title></head>
      <body>
        <h1>Login</h1>
        <form action="/login" method="post">
          <label>First Name:</label><br>
          <input type="text" name="firstname"><br>
          <label>Password:</label><br>
          <input type="password" name="password"><br>
          <input type="submit" value="Login">
        </form>
      </body>
    </html>
  `);
});

app.get('/register', (req, res) => {
  res.send(`
    <html>
      <head><title>Register</title></head>
      <body>
        <h1>Register</h1>
        <form action="/register" method="post">
          <label>First Name:</label><br>
          <input type="text" name="firstname"><br>
          <label>Middle Name:</label><br>
          <input type="text" name="middlename"><br>
          <label>Last Name:</label><br>
          <input type="text" name="lastname"><br>
          <label>Email:</label><br>
          <input type="email" name="email"><br>
          <label>Password:</label><br>
          <input type="password" name="password"><br>
          <label>Address:</label><br>
          <input type="text" name="address"><br>
          <label>Phone:</label><br>
          <input type="text" name="phone"><br>
          <label>Blood Group:</label><br>
          <input type="text" name="bloodGroup"><br>
          <label>Gender:</label><br>
          <input type="text" name="gender"><br>
          <label>City:</label><br>
          <input type="text" name="city"><br>
          <input type="submit" value="Register">
        </form>
      </body>
    </html>
  `);
});

// Handle form submission to register users
app.post('/register', (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    email,
    password,
    address,
    phone,
    bloodGroup,
    gender,
    city,
  } = req.body;

  // Create a new user object
  const newUser = {
    Firstname: firstname,
    Middlename: middlename,
    Lastname: lastname,
    Email: email,
    Password: password,
    Address: address,
    Phone: phone,
    BloodGroup: bloodGroup,
    Gender: gender,
    City: city,
  };

  // Save the user to the in-memory array
  users.push(newUser);

  res.send(
    'You have successfully registered for the GRE! You can now login and view your admit card'
  );
});

// Handle form submission to login users
app.post('/login', (req, res) => {
  const { firstname, password } = req.body;

  // Find user by firstname (assuming firstname is unique in this case)
  const user = users.find((u) => u.Firstname === firstname);

  if (!user) {
    return res.send('User not found. Please register first.');
  }

  // Check if passwords match
  if (user.Password !== password) {
    return res.send('Invalid password. Please try again.');
  }

  // If login is successful, render the admit card page
  const admitCardNumber = 'GRE' + Math.floor(100000 + Math.random() * 900000);
  res.send(`
    <html>
      <head>
        <title>Admit Card GRE(2024-25)</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .box3 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 900px;
            background-color: white;
            border: 2px solid #333;
            border-radius: 15px;
            padding: 30px;
            margin: 20px auto;
            box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
            text-align: left;
          }
          .box3 h1 {
            font-size: 28px;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
          }
          .box3 p {
            font-size: 18px;
            margin: 8px 0;
          }
          h4 {
            font-size: 25px;
            font-weight: bold;
            background-color: red;
          }
          .box3 strong {
            color: #333;
          }
          @media (max-width: 900px) {
            .box3 {
              width: 100%;
              padding: 20px;
            }
            .box3 p {
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="box3" id="admitCard">
          <h1>Admit Card GRE(2024-25)</h1>
          <p><strong>Registration Number:</strong> ${admitCardNumber}</p>
          <p><strong>First Name:</strong> ${user.Firstname}</p>
          <p><strong>Middle Name:</strong> ${user.Middlename}</p>
          <p><strong>Last Name:</strong> ${user.Lastname}</p>
          <p><strong>Address:</strong> ${user.Address}</p>
          <p><strong>Phone number of the candidate:</strong> ${user.Phone}</p>
          <p><strong>Blood Group of the candidate:</strong> ${user.BloodGroup}</p>
          <p><strong>Gender of the candidate:</strong> ${user.Gender}</p>
          <p><strong>City from which the candidate wants to take the test:</strong> ${user.City}</p>
          <h4><strong>You are advised to download the admit card for the test</strong></h4>
          <div class="row mt-3">
            <div class="col-sm-12 text-center">
              <button onclick="printPage()" class="btn btn-primary">Print Page</button>
              <button onclick="saveAsPDF()" class="btn btn-primary">Save as PDF</button>
            </div>
          </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
        <script>
          function printPage() {
            window.print();
          }
          function saveAsPDF() {
            const element = document.getElementById('admitCard');
            html2pdf().from(element).save('AdmitCard_GRE_2024-25.pdf');
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
