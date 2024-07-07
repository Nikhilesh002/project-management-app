// create express app
const exp = require('express');
const app = exp();
const cors = require('cors')
require('dotenv').config();   // adds .env content to process obj, which is a global obj like document,window in browser

// import mongodb
const mongoClient = require('mongodb').MongoClient;

// Middleware for CORS
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

const path = require('path');
// deploy react build in this server
app.use(exp.static(path.join(__dirname, '../client/dist')));


// connect to db
mongoClient.connect(process.env.DB_URL)
  .then(client => {
    // get db obj, get collObj, share collObj with express app
    const projectDb = client.db('Cluster0');
    // usersCollection
    const usersCollection = projectDb.collection('usersCollection');
    app.set('usersCollection', usersCollection);
    // projectsCollection
    const projectsCollection = projectDb.collection('projectsCollection');
    app.set('projectsCollection', projectsCollection);
    console.log('DB connected successfully...');
  })
  .catch(err => console.log('Error in DB connection'))

// body parser middleware
app.use(exp.json());

// import apis
const projectApp = require('./APIs/project-api');

// send reqs to respective apis acc to paths
app.use('/', projectApp);

// Catch-all route to handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// express error handler
// it can only deal with synchronous errors
app.use((err, req, res, next) => {
  res.send({ message: 'error', payload: err.message });
})


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`http server started on ${port}...`));
