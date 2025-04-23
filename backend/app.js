import express from 'express';
import { getUsers,getUserById, createUser, getTransactions, getTransactionById, getTransactionByDate, createTransaction,deleteTransaction, createTotalTransactions, getTotalTransactionsbyId } from './database.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies


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
        res.status(201).send(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
})


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
app.get('/transactions/date/:date', async (req, res) => {
    const date = req.params.date;
    const transactions = await getTransactionByDate(date);
    if (transactions.length > 0) {
        res.send(transactions);
    } else {
        res.status(404).send('No transactions found for this date');
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
app.delete('/transactions/:id', async (req, res) => {
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

// Total transactions by user ID and date
app.post('/totaltransactions/:user_id/:date', async (req, res) => {
    const user_id = req.params.user_id;
    const date = req.params.date;
    try {
        const totalTransactions = await createTotalTransactions(user_id, date);
        res.status(201).send(totalTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating total transactions');
    }
})

app.get('/totaltransactions/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const totalTransactions = await getTotalTransactionsbyId(user_id);
    if (totalTransactions.length > 0) {
        res.send(totalTransactions);
    } else {
        res.status(404).send('No total transactions found for this user');
    }
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
})