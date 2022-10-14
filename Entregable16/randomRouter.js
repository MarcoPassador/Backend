import express from "express";
import { fork } from 'child_process';
const { Router } = express;
const randomRouter = Router()


export default randomRouter;


randomRouter.get('/', (req, res) => {
    const numeros = req.query.cant || 100000;
    const forked = fork('../Entregable16/numbers.js', ['--c', numeros]);

    forked.on('message', nums => {
        return res.json(nums)
    })

})