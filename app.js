import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'
import {router} from './Routes/routes.js';
const app = express();
import './db/connection.js'

app.use(cors());
app.use(express.json());
app.use(router);
app.use('/uploads', express.static('./uploads'));
app.use('/files', express.static('./public/files'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
