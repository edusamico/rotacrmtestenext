import { NextApiRequest, NextApiResponse } from 'next';
import pool from './clientes/db';
import calcularMenorRota from '@/app/utils/calcularMenorRota';

export default async function calcularRotaHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const rota = await calcularMenorRota(pool);
            res.status(200).json(rota);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao calcular a rota' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Método ${req.method} não permitido`);
    }
}
