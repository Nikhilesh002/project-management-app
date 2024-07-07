// create projectApp mini express app
const exp = require('express');
const projectApp = exp.Router();
const bcryptjs = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = require('../middlewares/verifyToken');
const { ObjectId } = require('mongodb');

projectApp.use(exp.json());

let usersCollection, projectsCollection;
projectApp.use((req, res, next) => {
  usersCollection = req.app.get('usersCollection');
  projectsCollection = req.app.get('projectsCollection');
  next();
});

// user reg route
projectApp.post('/register', expressAsyncHandler(async (req, res) => {
  const newUser = req.body;
  const dbUser = await usersCollection.findOne({ username: newUser.username });
  if (dbUser !== null) {
    res.send({ message: "Username already exists" });
  }
  else {
    const hashedPwd = await bcryptjs.hash(newUser.password, 6);
    newUser.password = hashedPwd;
    const dbRes = await usersCollection.insertOne({ ...newUser });
    if (dbRes.acknowledged === true) {
      res.send({ message: "Registration Successful" });
    }
    else {
      res.send({ message: "Registration Failed" });
    }
  }
}));

// user login route
projectApp.post('/login', expressAsyncHandler(async (req, res) => {
  const userCred = req.body;
  const dbUser = await usersCollection.findOne({ username: userCred.username });
  if (dbUser === null) {
    res.send({ message: "Invalid Username" });
  }
  else {
    const pwdMatch = await bcryptjs.compare(userCred.password, dbUser.password);
    if (pwdMatch === false) {
      res.send({ message: "Invalid Password" });
    }
    else {
      // create jwt and send
      const signedToken = jwt.sign({ username: dbUser.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
      res.send({ message: "Login Success", token: signedToken, user: dbUser });
    }
  }
}));

// get all users
projectApp.get('/users', verifyToken, expressAsyncHandler(async (req, res) => {
  const usersList = await usersCollection.find({}).toArray();
  res.send({ message: "All users", payload: usersList });
}));

// get all projects
projectApp.get('/projects', verifyToken, expressAsyncHandler(async (req, res) => {
  const projectsList = await projectsCollection.find({}).toArray();
  res.send({ message: "All projects", payload: projectsList });
}));

// get project by id
projectApp.get('/project/:projectId', verifyToken, expressAsyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
  if (project === null) {
    res.send({ message: "Project not found" });
  }
  else {
    res.send({ message: "All tickets", payload: project });
  }
}));

// add new project
projectApp.post('/projects/new-project', verifyToken, expressAsyncHandler(async (req, res) => {
  const newProject = req.body;
  const dbRes = await projectsCollection.insertOne({ ...newProject });
  if (dbRes.acknowledged === true) {
    res.send({ message: "Project added successfully" });
  }
  else {
    res.send({ message: "Project addition failed" });
  }
}));

// add new ticket to a project by id
projectApp.post('/project/new-ticket', verifyToken, expressAsyncHandler(async (req, res) => {
  const newTicket = req.body;
  const projectId = newTicket.projectId;
  const dbRes = await projectsCollection.updateOne({ _id: new ObjectId(projectId) }, { $push: { tickets: newTicket } });
  if (dbRes.acknowledged === true) {
    res.send({ message: "Ticket added successfully" });
  }
  else {
    res.send({ message: "Ticket addition failed" });
  }
}));

// change status of ticket by id
projectApp.put('/ticket/change-status', verifyToken, expressAsyncHandler(async (req, res) => {
  const { projectId, ticketId, newStatus } = req.body;

  const dbRes = await projectsCollection.updateOne(
    { _id: new ObjectId(projectId), "tickets.id": ticketId },
    { $set: { "tickets.$.status": newStatus } }
  );

  if (dbRes.modifiedCount === 1) {
    res.send({ message: "Ticket status updated successfully" });
  } else {
    res.send({ message: "Ticket status update failed" });
  }
}));

// change status of project by id
projectApp.put('/project/change-status', verifyToken, expressAsyncHandler(async (req, res) => {
  const { projectId, newStatus } = req.body;

  const dbRes = await projectsCollection.updateOne({ _id: new ObjectId(projectId) }, { $set: { status: newStatus } });
  if (dbRes.acknowledged === true) {
    res.send({ message: "Project status updated successfully" });
  }
  else {
    res.send({ message: "Project status update failed" });
  }
}));

// delete ticket by id
projectApp.delete('/project/delete-ticket', verifyToken, expressAsyncHandler(async (req, res) => {
  const { projectId, ticketId } = req.body;
  const dbRes = await projectsCollection.updateOne({ _id: new ObjectId(projectId) }, { $pull: { tickets: { id: ticketId } } });
  if (dbRes.acknowledged === true) {
    res.send({ message: "Ticket deleted successfully" });
  }
  else {
    res.send({ message: "Ticket deletion failed" });
  }
}));

module.exports = projectApp;