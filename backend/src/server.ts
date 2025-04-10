import express from 'express';
import cors from 'cors';
import { sample_transactions } from './data';

const app = express();
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.get('/api/transactions', (req, res) => {
    res.send(sample_transactions);
})

app.get('/api/transactions/lasttransactions', (req, res) => {
    const lastTransactions = sample_transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
        .slice(0, 3) // Get the last 3 transactions
        .reverse(); // Reverse the order to get the last 3 transactions in ascending order

    res.send(lastTransactions);
})

app.get('/api/transactions/:id', (req, res) => {
    const transactionid = req.params.id;
    const transaction = sample_transactions.find(transaction => transaction.id == transactionid);
    res.send(transaction);
})


const PORT = 5000;

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})