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
const bcrypt = require("bcrypt");

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("ce1_sbms"); 
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
    res.render('index'); 
});
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes); 
app.use('/invoice', invoiceRoutes); 
app.use('/inventory',inventoryRoutes);
app.use('/cart',cartRoutes)
app.use('/category', categoryRoutes);



  app.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Signup',
        body: ''
    });
});

app.post('/register', async (req, res) => {
    try {
      const { name, email, password, phone_number, address ,role} = req.body;
  

      if (!name || !email || !password || !phone_number || !address) {
        throw new Error('All fields are required');
      }
  

      const existingUser = await req.db.collection('logged_users').findOne({ email });
      if (existingUser) {
        return res.status(400).send('User already exists');
      }
      const hpassword = await bcrypt.hash(password,10);
      const newUser = {
        name,
        email,
        password:hpassword, 
        phone_number,
        address,
        role,
      };
  

      await req.db.collection('logged_users').insertOne(newUser);
  

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
        body: '' 
    });
})

  app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { errorMessage: 'Email and password are required' });
        }


        const user = await req.db.collection('logged_users').findOne({ email });

        if (!user) {
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { errorMessage: 'Invalid email or password' });
        }

        req.session.user_id = user._id;
        req.session.email = user.email;
        req.session.name = user.name;


        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


  

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
