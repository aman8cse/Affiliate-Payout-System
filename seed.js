import mongoose from "mongoose";
import env from "../src/config/env.js";
import { connectDB } from "../src/config/db.js";

import User from "../src/models/User.js";
import Wallet from "../src/models/Wallet.js";
import Sale from "../src/models/Sale.js";
import Transaction from "../src/models/Transaction.js";
import Withdrawal from "../src/models/Withdrawal.js";

async function seed() {

    await connectDB();
    await User.deleteMany();
    await Wallet.deleteMany();
    await Sale.deleteMany();
    await Transaction.deleteMany();
    await Withdrawal.deleteMany();

    const users = await User.insertMany([

        {

            name: "Aman",

            email: "aman@test.com"

        },

        {

            name: "Rahul",

            email: "rahul@test.com"

        }

    ]);

    await Wallet.insertMany([

        {

            user: users[0]._id

        },

        {

            user: users[1]._id

        }

    ]);

    await Sale.insertMany([

        {

            user: users[0]._id,

            commissionAmount: 100000,

            advanceAmount: 10000

        },

        {

            user: users[0]._id,

            commissionAmount: 200000,

            advanceAmount: 20000

        },

        {

            user: users[1]._id,

            commissionAmount: 50000,

            advanceAmount: 5000

        },

        {

            user: users[1]._id,

            commissionAmount: 80000,

            advanceAmount: 8000

        }

    ]);

    console.log("Seed Completed");

    await mongoose.disconnect();

}

seed();