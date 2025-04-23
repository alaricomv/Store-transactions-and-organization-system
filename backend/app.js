import express from 'express';
import { getUsers,getUserById, createUser } from './database.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/users', async (req, res) => {
    const notes = await getUsers();
    res.send(notes);
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await getUserById(id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
})

app.post('/users', express.json(), async (req, res) => {
    const { company_name, branch_name, password, email } = req.body;
    if (!company_name || !branch_name || !password || !email) {
        return res.status(400).send('All fields are required');
    }
    try {
        const newUser = await createUser(company_name, branch_name, password, email);
        res.status(201).send(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
})