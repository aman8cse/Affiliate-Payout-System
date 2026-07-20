import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";

class UserService {

    //create a new user
    async createUser(data) {
        const existingUser = await User.findOne({
            email: data.email
        });

        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        const user = await User.create({
            name: data.name,
            email: data.email
        });

        await Wallet.create({
            user: user._id
        });

        return user;
    }


    //get a user by id
    async getUserById(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return user;
    }
}

export default new UserService();