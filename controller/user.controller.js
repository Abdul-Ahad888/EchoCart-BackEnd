const User = require('../model/user.model')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const key = process.env.JWT_KEY || "wqryqwohraskbfasfaskjfnbasjkbf839479827489273489ksdnfknsefkj824y982y4nszf"

const createToken = async (user) => {

    try {
        const token = await jwt.sign({ id: user.id, role: user.role }, key, { expiresIn: '30d' })
        return token
    }

    catch (err) {
        console.error("Token creation failed:", err);
        throw new Error("Token Creation Failed")
    }

}

const register = async (req, res) => {

    try {

        const { username, email, password, dob, selectGender, selectCountry, phoneNum, age } = req.body

        if (!username || !email || !password || !dob || !selectGender || !selectCountry) {
            return res.status(400).json({ msg: "Please provide complete credentials" })
        }

        if (!validator.isAlphanumeric(username)) {
            return res.status(400).json({ msg: "Username should contains alphabets and numbers only" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ msg: "Please provide a valid email address" })
        }

        const userExist = await User.findOne({ where: { email } });
        if (userExist) {
            return res.status(400).json({ msg: "Email already in use" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ msg: "Password Must Be Strong Enough!" })
        }



        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const userResponce = await User.create({ username, email, dob, selectGender, selectCountry, phoneNum, age, password: hashPassword })

        res.status(201).json({ msg: "User Created Successfully" })

    }

    catch (err) {
        res.status(500).json({ msg: "Error While Creating User", err: err.message })
    }
}

const logIn = async (req, res) => {

    const { email, password } = req.body

    try {

        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide complete credentials" })
        }

        const userDetails = await User.findOne({ where: { email } });
        if (!userDetails) {
            return res.status(400).json({ msg: "Email Not Found" })
        }

        const isCompared = await bcrypt.compare(password, userDetails.password)
        if (!isCompared) {
            return res.status(400).json({ msg: "Incorrect Password" })
        }

        const token = await createToken(userDetails)

        res.status(200).json({ msg: "User Loged In Successfully", data: { username: userDetails.username, email: userDetails.email, role: userDetails.role, token } })

    }

    catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const userDetails = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findByPk(userId, {
            attributes: ['username', 'email', 'age', 'selectGender', 'selectCountry', 'dob', 'phoneNum', 'profileImage']
        })

        if (!user) {
            return res.status(404).json({ msg: "User Not Found" })
        }

        res.status(200).json({ user })
    }

    catch (err) {
        res.status(500).json({ msg: "Error Fetching User", err: err.message })
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: "No image uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'echocart/users/profiles'
        });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.profileImage = result.secure_url;
        await user.save();

        res.status(200).json({
            msg: "Profile image uploaded successfully",
            imageUrl: result.secure_url,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error while uploading image", err: err.message });
    }
};

const changePassword = async (req, res) => {

    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ msg: 'both current and new password are required ' })
        }

        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(400).json({ msg: 'user not found' })
        }

        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ msg: 'new password must be strong' })
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({ msg: 'current password is incorrect' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashPassword
        await user.save()

        res.status(200).json({ msg: 'password updated' })
    }

    catch (err) {
        res.status(500).json({ msg: "Error while changing password", err: err.message });
    }

}

const totalUser = async (req, res) => {
    try {
        const count = await User.count()
        res.status(200).json({ totalUser: count })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const getAllUsers = async (req, res) => {
    try {

        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'createdAt', 'role', 'lastActive']
        })

        const now = Date.now();
        const usersWithStatus = users.map((u) => {
            const isOnline = now - new Date(u.lastActive).getTime() < 5 * 60 * 1000; // 5 min
            return {
                ...u.toJSON(),
                status: isOnline ? "online" : "offline",
            };
        });

        res.status(200).json(usersWithStatus)

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!["unassigned", "admin", "owner"].includes(role)) {
            return res.status(400).json({ message: "Invalid Role" })
        }

        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        user.role = role
        await user.save()

        res.json({ message: "Role Updated", user })

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}



module.exports = { userDetails, register, logIn, uploadProfileImage, changePassword, totalUser, getAllUsers, updateUserRole }