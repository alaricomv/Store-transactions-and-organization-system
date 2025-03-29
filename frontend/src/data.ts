import { Transaction } from "./app/shared/models/transaction";

export const sample_transactions: Transaction[] = [
    {id: 1, user: 1, date: new Date('2023-01-01T10:30:00'), total: 100.00},
    {id: 2, user: 1, date: new Date('2023-01-02T11:00:00'), total: 200.00},
    {id: 3, user: 1, date: new Date('2023-01-03T12:00:00'), total: 300.00},
    {id: 4, user: 1, date: new Date('2023-01-03T09:00:00'), total: 400.00},
]