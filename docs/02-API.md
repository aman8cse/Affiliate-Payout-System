# API Documentation

## User

### Create User

POST

```http
/api/users
```

Body

```json
{
    "name":"Aman",
    "email":"aman@test.com"
}
```

---

### Get User

GET

```http
/api/users/:userId
```

---

## Sales

Create Sale

POST

```http
/api/sales
```

```json
{
    "userId":"...",
    "commissionAmount":100000
}
```

Money is stored in **paise**.

---

Get Sales

GET

```http
/api/sales
```

---

Confirm Sale

POST

```http
/api/sales/:id/confirm
```

---

Reject Sale

POST

```http
/api/sales/:id/reject
```

---

## Wallet

GET

```http
/api/wallet/:userId
```

---

Transactions

GET

```http
/api/wallet/:userId/transactions
```

---

## Withdrawals

Create

POST

```http
/api/withdrawals
```

```json
{
    "userId":"...",
    "amount":50000
}
```

---

History

GET

```http
/api/withdrawals/:userId
```