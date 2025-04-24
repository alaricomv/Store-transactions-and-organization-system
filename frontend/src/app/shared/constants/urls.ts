const BASE_URL = 'http://localhost:8080';

export const TRANSACTIONS_URL = `${BASE_URL}/transactions`;
export const LAST_TRANSACTIONS_URL = BASE_URL + '/lasttransactions';
export const TRANSACTION_BY_ID_URL = TRANSACTIONS_URL + '/';
export const TRANSACTION_BY_DATE_URL = TRANSACTIONS_URL + '/date/';
export const TOTAL_TRANSACTIONS_URL = BASE_URL + '/totaltransactions';
export const TOTAL_TRANSACTIONS_BY_ID_URL = TOTAL_TRANSACTIONS_URL + '/';
export const USERS_URL = BASE_URL + '/users';
export const USER_BY_ID_URL = USERS_URL + '/';
export const USER_LOGIN_URL = BASE_URL + '/users/login';