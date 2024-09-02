const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const invoiceRoutes = require("./routes/invoiceRoutes")
const inventoryRoutes=require("./routes/inventoryRoutes")
const cartRoutes = require("./routes/cartRoutes")
const session = require('express-session');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require('path'); 
const app = express();
const url = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
const client = new MongoClient(url);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("ce1_sbms"); // Set the database name to "ce1_sbms"
        console.log("Connected to the database");
    } catch (err) {
        console.error("Failed to connect to the database", err);
    }
}

connectDB();

app.use(express.static('public'));




app.use(session({
    secret: 'tanishq1234',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  }));

app.use((req, res, next) => {
    req.db = db;  
    next();
});

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index');  // Make sure index.ejs exists in views folder
});
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);  // Mount user routes
app.use('/invoice', invoiceRoutes); 
app.use('/inventory',inventoryRoutes);
app.use('/cart',cartRoutes)
app.use('/category', categoryRoutes);



  app.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Signup',
        body: '' // Empty body as the content is directly set in signup.ejs
    });
});

app.post('/register', async (req, res) => {
    try {
      const { name, email, password, phone_number, address ,role} = req.body;
  
      // Validate required fields
      if (!name || !email || !password || !phone_number || !address) {
        throw new Error('All fields are required');
      }
  
      // Check if the user already exists
      const existingUser = await req.db.collection('logged_users').findOne({ email });
      if (existingUser) {
        return res.status(400).send('User already exists');
      }
  
      // Hash the password for security
    //   const password_hash = password;
  
      // Create the new user object
      const newUser = {
        name,
        email,
        password, // Store the hashed password
        phone_number,
        address,
        role,
      };
  
      // Insert the new user into the database
      await req.db.collection('logged_users').insertOne(newUser);
  
      // Redirect to the login page after successful registration
      res.redirect('/login');
    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  


app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'dashboard',
        body: '' // Empty body as the content is directly set in signup.ejs
    });
})

  app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { errorMessage: 'Email and password are required' });
        }

        // Find the user by email
        const user = await req.db.collection('logged_users').findOne({ email });

        if (!user) {
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        // Compare the provided password with the stored password
        // Note: In a real application, passwords should be hashed and compared securely
        if (user.password !== password) {
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        // Store user details in session
        req.session.user_id = user._id;
        req.session.email = user.email;
        req.session.name = user.name;

        // Redirect to dashboard after successful login
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


  

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
