
import { User } from '../models/userSchema.js';
import moment from 'moment'
import csv from 'fast-csv'
import fs from 'fs'
const BASE_URL = process.env.BASE_URL


// Register

export const userRegister = async (req, res) => {

    const file = req.file.filename;
    const { fname, lname, email, mobile, gender, location, status } = req.body

    if (!fname || !lname || !email || !mobile || !gender || !location || !status || !file) {
        res.status(401).json("All Inputs is required")
    }

    try {
        const userExist = await User.findOne({ email: email })

        if (userExist) {
            res.status(401).send("this user is already exist")
        } else {

            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

            const userData = new User({
                fname, lname, email, mobile, gender, location, status, profile: file, datecreated
            })
            await userData.save();
            res.status(200).send(userData)
        }
    } catch (error) {
        res.status(401).send(error)
        console.log("catch block error");
    }


};

// Get All Users

export const getAllUsers = async (req, res) => {
    console.log(req.query);
    const search = req.query.search || ""
    const gender = req.query.gender || ""
    const status = req.query.status || ""
    const sort = req.query.sort || ""
    const page = req.query.page || 1
    const ITEM_PER_PAGE = 4;

    const query = {
        fname: { $regex: search, $options: "i" }
    }

    if (gender !== "All") {
        query.gender = gender
    }

    if (status !== "All") {
        query.status = status
    }

    try {

        const skip = (page - 1) * ITEM_PER_PAGE
        const count = await User.countDocuments(query)


        const users = await User.find(query)
            .sort({ datecreated: sort == "new" ? -1 : 1 })
            .limit(ITEM_PER_PAGE)
            .skip(skip)

            const pageCount = Math.ceil(count/ITEM_PER_PAGE)


        res.status(200).json({
            Pagination:{
                count, pageCount
            },
            users})
    } catch (error) {
        res.status(401).json(error)
        console.log("Error While getting users data");
    }
}

//Get Single User Data

export const getSingleUser = async (req, res) => {

    const { id } = req.params

    try {
        const user = await User.findOne({ _id: id });
        res.status(200).json(user)
    }
    catch (error) {
        res.status(401).json(error)
    }
}

//Update User

export const userEdit = async (req, res) => {
    const { id } = req.params

    const { fname, lname, email, mobile, gender, location, status, user_profile } = req.body
    const file = req.file ? req.file.filename : user_profile
    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

    try {
        const updateUserData = await User.findByIdAndUpdate({ _id: id }, {
            fname, lname, email, mobile, gender, location, status, profile: file, dateUpdated
        }, { new: true })

        await updateUserData.save()

        res.status(200).json(updateUserData);
    } catch (error) {
        res.status(401).json(error)
    }
};

// Delete User

export const deleteUserData = async (req, res) => {
    const { id } = req.params

    const userDelete = await User.findByIdAndDelete({ _id: id })

    try {
        res.status(200).json(userDelete)
    } catch (error) {
        res.status(401).json(error)
        console.log(error);
    }
};

//Change Status

export const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    try {
        const updateUserStatus = await User.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        res.status(200).json(updateUserStatus)
    } catch (error) {
        res.status(401).json(error)
    }
};

export const exportUsers = async (req, res) => {
    try {
        const allUsersData = await User.find();
        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync("public/files/export")) {
            if (!fs.existsSync("public/files")) {
                fs.mkdirSync("public/files/")
            }

            if (!fs.existsSync("public/files/export")) {
                fs.mkdirSync("./public/files/export")
            }
        };

        const writetableStream = fs.createWriteStream(
            "public/files/export/users.csv"
        )

        csvStream.pipe(writetableStream);

        writetableStream.on("finish", function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`
            })
        });

        if (allUsersData.length > 0) {
            allUsersData.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    LastName: user.lname ? user.lname : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateUpdated ? user.dateUpdated : "-"
                })
            })
        }

        csvStream.end();
        writetableStream.end();

    } catch (error) {
        res.status(401).json(error)
        console.log(error);
    }
}
