# System Architecture

## High Level Flow

```text
User

↓

Sale Created

↓

Pending

↓

BullMQ Advance Batch

↓

Wallet Credit

↓

Admin Verification

↓

Confirmed / Rejected

↓

BullMQ Final Batch

↓

Wallet Credit / Debit

↓

Withdrawal Request

↓

BullMQ Withdrawal Worker

↓

Payment Gateway
```