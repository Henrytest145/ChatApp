import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/message.route';
const app = express();
const PORT = 3000;
import dotenv from 'dotenv';
dotenv.config();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    console.log("Ejecutando ruta main");
    res.send("MAIN");
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en: http://localhost:3000');
    
})