import express from 'express';

const router = express.Router();

router.post('/conversations', (req, res) => {
    console.log("Ruta de conversacion");
    
});

export default router;