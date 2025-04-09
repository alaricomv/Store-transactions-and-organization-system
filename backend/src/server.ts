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

const PORT = 5000;

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})