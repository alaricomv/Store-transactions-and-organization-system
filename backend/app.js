import express from 'express';
import { getUsers,getUserById, createUser, getTransactions, getLastTransactions, getTransactionById, getTransactionByDate, createTransaction,deleteTransaction, createTotalTransactions, getTotalTransactionsbyId,getTotalTransactionByDate ,getTotalTransactionsbyUserId, getLastTotalTransactions, getUserVerification, deleteTotalTransaction } from './database.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(cors({origin: process.env.FRONTEND_URL})); // Enable CORS for your frontend app, 'http://localhost:4200'


// User routes

// All users
app.get('/users', async (req, res) => {
    const notes = await getUsers();
    res.send(notes);
});

// User by ID
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await getUserById(id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
})

// Create user
app.post('/users', express.json(), async (req, res) => {
    const { company_name, branch_name, password, email } = req.body;
    if (!company_name || !branch_name || !password || !email) {
        return res.status(400).send('All fields are required');
    }
    try {
        const newUser = await createUser(company_name, branch_name, password, email);
        res.status(201).send(generateTokenResponse(newUser));
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})

// Check if user exists and password is correct
app.post('/users/login', express.json(), async (req, res) => {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }
    try {
        const user = await getUserVerification(email, password);
        if (user) {
            if (rememberMe) {
                res.status(200).send(generateRememberMeTokenResponse(user));
            } else {
                res.status(200).send(generateTokenResponse(user));
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in user');
    }
});


// Transactions routes

//All transactions
app.get('/transactions', async (req, res) => {
    const transactions = await getTransactions();
    res.send(transactions);
});

// Transaction by ID
app.get('/transactions/:id', async (req, res) => {
    const id = req.params.id;
    const transaction = await getTransactionById(id);
    if (transaction) {
        res.send(transaction);
    } else {
        res.status(404).send('Transaction not found');
    }
})

// Transaction by date
app.get('/transactions/date/:date/:user_id', async (req, res) => {
    const date = req.params.date;
    const user_id = req.params.user_id;
    const transactions = await getTransactionByDate(date,user_id);
    if (transactions.length > 0) {
        res.send(transactions);
    } else {
        res.status(404).send('No transactions found for this date');
    }
})

//Last 3 transactions by user ID
app.get('/lasttransactions/:id', async (req, res) => {
    const id = req.params.id;
    const transactions = await getLastTransactions(id);
    if (transactions.length > 0) {
        res.send(transactions);
    } else {
        res.status(404).send('No transactions found for this user');
    }
})

// Create transaction
app.post('/transactions', express.json(), async (req, res) => {
    const { user_id, total } = req.body;
    if (!user_id || !total) {
        return res.status(400).send('All fields are required');
    }
    try {
        const newTransaction = await createTransaction(user_id, total);
        res.status(201).send(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating transaction');
    }
})

// Delete transaction
app.put('/transactions/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await deleteTransaction(id);
        if (result) {
            res.status(204).send("Deleted correctly"); // No content to send back
        } else {
            res.status(404).send('Transaction not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting transaction');
    }
})

// Total transactions routes

// Total transactions by ID
app.get('/totaltransactions/:id', async (req, res) => {
    const id = req.params.id;
    const transaction = await getTotalTransactionsbyId(id);
    if (transaction) {
        res.send(transaction);
    } else {
        res.status(404).send('Transaction not found');
    }
})

// Total transactions by date
app.get('/totaltransactions/date/:date/:user_id', async (req, res) => {
    const date = req.params.date;
    const user_id = req.params.user_id;
    const transactions = await getTotalTransactionByDate(date,user_id);
    if (transactions.length > 0) {
        res.send(transactions);
    } else {
        res.status(404).send('No total transactions found for this date');
    }
})


// Total transactions by user ID and date
app.post('/totaltransactions', async (req, res) => {
    const { user_id, date } = req.body;
    if (!user_id || !date) {
        return res.status(400).send('All fields are required');
    }
    try {
        const newTransaction = await createTotalTransactions(user_id, date);
        res.status(201).send(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating total transaction');
    }
})

// Total transactions by user ID
app.get('/totaltransactions/user/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const totalTransactions = await getTotalTransactionsbyUserId(user_id);
    if (totalTransactions.length > 0) {
        res.send(totalTransactions);
    } else {
        res.status(404).send('No total transactions found for this user');
    }
})

// Last 3 total transactions by user ID
app.get('/lasttotaltransactions/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const transactions = await getLastTotalTransactions(user_id);
    if (transactions.length > 0) {
        res.send(transactions);
    } else {
        res.status(404).send('No total transactions found for this user');
    }
})

// Delete total transaction
app.delete('/totaltransactions/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await deleteTotalTransaction(id);
        if (result) {
            res.status(204).send("Deleted correctly"); // No content to send back
        } else {
            res.status(404).send('Transaction not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting transaction');
    }
})

const generateTokenResponse = (user) => {
    const token = jwt.sign({ 
        email: user.email, isAdmin: user.isAdmin
    }, 'RandomSecret', { expiresIn: '1h' });
    user.token = token;
    return user;
}

const generateRememberMeTokenResponse = (user) => {
    const token = jwt.sign({ 
        email: user.email, isAdmin: user.isAdmin
    }, 'RandomSecret');
    user.token = token;
    return user;
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
})