# Design Decisions

This document explains the rationale behind the architecture and implementation choices made in the Affiliate Payout System.

---

# 1. Why BullMQ instead of node-cron?

The assignment requires batch processing.

A simple cron job works only inside a single application instance.

BullMQ was chosen because it provides:

- Persistent jobs
- Redis-backed queue
- Retry support
- Worker separation
- Horizontal scalability

Current Design

Scheduler
↓

BullMQ Queue
↓

Worker
↓

Business Logic

This allows API requests to remain fast while heavy payout processing happens asynchronously.

---

# 2. Why Batch Processing?

Instead of processing every sale individually,

100 sales

↓

100 payment operations

↓

Higher load

the system groups all pending sales for a user.

100 Sales
↓

One Wallet Update

↓

100 Ledger Entries

↓

Future Gateway Call (Single)

This significantly reduces future payment gateway operations while maintaining complete auditability.

---

# 3. Why Wallet + Transaction Ledger?

Wallet stores only the current financial state.

Transaction stores every financial event.

Without Transaction history:

Current Balance = ₹12,000

No explanation of how balance became ₹12,000.

With Ledger:

Advance Credit

Final Credit

Withdrawal

Final Debit

Everything is auditable.

---

# 4. Why MongoDB Transactions?

Financial operations modify multiple collections.

Wallet

+

Transaction

+

Sale

These operations must succeed together.

MongoDB transactions ensure:

Commit All

or

Rollback All

No partial updates.

---

# 5. Why Store Money in Paise?

Floating point values introduce precision issues.

Incorrect

0.1 + 0.2

Correct

10000 paise

+

20000 paise

=

30000 paise

All monetary values are stored as integer paise.

---

# 6. Why Thin Controllers?

Controllers only:

- Accept Request
- Call Service
- Return Response

Business logic remains inside Services.

Benefits

- Easy testing
- Better maintainability
- Reusable logic

---

# 7. Why Separate Services?

UserService

User operations

WalletService

Wallet balance updates

SaleService

Sale lifecycle

TransactionService

Ledger creation

WithdrawalService

Withdrawal requests

Each service owns one responsibility.

---

# 8. Why Queue-Based Withdrawals?

Withdrawal processing should not block the API.

Request

↓

Queue

↓

Worker

↓

Gateway

↓

Wallet

↓

Ledger

The API returns immediately while processing continues asynchronously.

---

# 9. Why Group Sales by User?

Instead of

Sale

↓

Wallet Update

↓

Sale

↓

Wallet Update

↓

Sale

↓

Wallet Update

The worker performs

User

↓

Calculate Total

↓

One Wallet Update

↓

One Transaction Per Sale

This minimizes writes while preserving audit history.

---

# 10. Production Improvements

The following were intentionally excluded to keep the assignment focused:

- JWT Authentication
- RBAC
- Idempotency Keys
- Dead Letter Queue
- Retry Policies
- Metrics & Monitoring
- Distributed Tracing
- Kubernetes Deployment

These would be added for a production deployment but are outside the scope of this LLD assignment.