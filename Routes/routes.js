import express from 'express'
import { userRegister, getAllUsers, getSingleUser, userEdit, deleteUserData, updateStatus, exportUsers } from '../Controllers/userController.js';
import {upload} from '../MulterConfig/storageConfig.js';

const router = express.Router();

router.post('/user/register', upload.single("user_profile"), userRegister);

router.get('/users', getAllUsers)

router.get('/user/:id', getSingleUser)

router.put('/update-user/:id', upload.single("user_profile"), userEdit)

router.delete('/delete-user/:id', deleteUserData)

router.put('/update-user-status/:id', updateStatus)

router.get('/export-users', exportUsers)

export {router}