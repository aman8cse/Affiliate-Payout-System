# Complete Workflow

## 1. User Registration

```text
Create User

↓

Create Wallet
```

---

## 2. Sale Creation

```text
Create Sale

↓

Status

PENDING
```

---

## 3. Advance Batch

```text
BullMQ Scheduler

↓

Find Pending Sales

↓

Group By User

↓

Wallet Credit

↓

Ledger Entry

↓

advancePaid=true
```

---

## 4. Admin Verification

Confirmed

```text
Final Amount

=

Commission

-

Advance
```

Rejected

```text
Final Amount

=

-Advance
```

---

## 5. Final Batch

```text
BullMQ

↓

Confirmed + Rejected

↓

Group By User

↓

Wallet Update

↓

Ledger

↓

finalPaid=true
```

---

## 6. Withdrawal

```text
Withdrawal Request

↓

Queue

↓

Worker

↓

Gateway

↓

Wallet Debit

↓

Ledger

↓

SUCCESS
```

---

## Failure Handling

Mongo Transaction

```text
Wallet

+

Transaction

+

Sale

↓

Commit

OR

Rollback
```