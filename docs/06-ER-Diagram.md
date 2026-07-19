# Entity Relationship Diagram (ERD)

## Overview

The Affiliate Payout System consists of five core entities:

- User
- Wallet
- Sale
- Transaction
- Withdrawal

Each user owns exactly one wallet. Sales generate earnings, wallet stores the current balance, transactions maintain the immutable ledger, and withdrawals represent payout requests.

---

## Entity Relationship Diagram

```text
                                        +----------------------+
                                        |        USER          |
                                        +----------------------+
                                        | _id                 |
                                        | name                |
                                        | email               |
                                        | createdAt           |
                                        +----------+-----------+
                                                   |
                 +---------------------------------+----------------------------------+
                 |                                 |                                  |
               1 |                               1:N |                              1:N |
                 |                                 |                                  |
                 ▼                                 ▼                                  ▼

      +----------------------+         +-------------------------+        +-------------------------+
      |       WALLET         |         |          SALE           |        |      WITHDRAWAL         |
      +----------------------+         +-------------------------+        +-------------------------+
      | _id                  |         | _id                     |        | _id                     |
      | user (FK)            |         | user (FK)               |        | user (FK)              |
      | balance              |         | brand                   |        | amount                 |
      | lifetimeEarnings     |         | earning                 |        | status                 |
      | totalWithdrawn       |         | advanceAmount           |        | processedAt            |
      | createdAt            |         | finalAmount             |        | createdAt              |
      +----------+-----------+         | status                  |        +-------------------------+
                 |                     | advancePaid             |
                 | 1:N                 | finalPaid               |
                 |                     | createdAt               |
                 ▼                     +-------------------------+

      +--------------------------------------+
      |             TRANSACTION              |
      +--------------------------------------+
      | _id                                 |
      | wallet (FK)                         |
      | type                                |
      | amount                              |
      | balanceAfter                        |
      | referenceType                       |
      | referenceId                         |
      | remarks                             |
      | createdAt                           |
      +--------------------------------------+
```

---

# Relationships

| Parent | Child | Cardinality |
|---------|-------|-------------|
| User | Wallet | One-to-One |
| User | Sale | One-to-Many |
| User | Withdrawal | One-to-Many |
| Wallet | Transaction | One-to-Many |

---

# Entity Responsibilities

## User

Stores affiliate user information.

One user owns one wallet.

One user can have multiple sales.

One user can request multiple withdrawals.

---

## Wallet

Represents the user's current financial state.

Stores:

- Current Balance
- Lifetime Earnings
- Total Withdrawn

Every balance update generates one or more immutable transaction records.

---

## Sale

Represents one affiliate sale.

Lifecycle

```text
PENDING
    │
    ├──────────────► Advance Paid
    │
    ▼
APPROVED ─────────────► Final Credit

or

REJECTED ─────────────► Final Debit
```

---

## Transaction

Immutable ledger of every wallet movement.

Possible transaction types:

- ADVANCE_CREDIT
- FINAL_CREDIT
- FINAL_DEBIT
- WITHDRAWAL
- WITHDRAWAL_REFUND

Transactions are never updated or deleted.

---

## Withdrawal

Represents a payout request.

Lifecycle

```text
PENDING
    │
    ▼
PROCESSING
    │
 ┌──┴───────────┐
 │              │
 ▼              ▼
SUCCESS      FAILED
                 │
                 ▼
          Wallet Refunded
```

---

# Financial Flow

```text
Create Sale
      │
      ▼
Pending
      │
      ▼
Advance Batch Worker
      │
      ▼
Wallet Credit
      │
      ▼
Ledger Entry
      │
      ▼
Admin Reconciliation
      │
 ┌────┴────────────┐
 │                 │
 ▼                 ▼
Approved        Rejected
 │                 │
 ▼                 ▼
Final Credit    Final Debit
      │
      ▼
Wallet Updated
      │
      ▼
Ledger Entry
      │
      ▼
Withdrawal Request
      │
      ▼
Withdrawal Queue
      │
      ▼
Withdrawal Worker
      │
      ▼
Payment Gateway
      │
 ┌────┴────────────┐
 │                 │
 ▼                 ▼
Success         Failed
 │                 │
 ▼                 ▼
Done       Wallet Refunded
                 │
                 ▼
         Refund Ledger Entry
```

---

# Design Notes

- Every user owns exactly one wallet.
- Wallet stores only the current financial state.
- Transaction stores the complete immutable financial history.
- Sales drive wallet changes through asynchronous BullMQ workers.
- MongoDB transactions ensure wallet updates, ledger entries, and sale/withdrawal status changes are committed atomically.
- BullMQ enables scalable background processing while keeping API responses fast.
- All monetary values are stored as integer paise to avoid floating-point precision issues.