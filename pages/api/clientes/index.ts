import { NextApiRequest, NextApiResponse } from 'next';
import pool from './db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const { rows } = await pool.query('SELECT * FROM clientes');
            res.status(200).json(rows);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'Ocorreu um erro desconhecido' });
            }
        }
    } else if (req.method === 'POST') {
        try {
            const { nome, email, telefone, coordenada_x, coordenada_y } = req.body;
            const { rows } = await pool.query(
                'INSERT INTO clientes (nome, email, telefone, coordenada_x, coordenada_y) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [nome, email, telefone, coordenada_x, coordenada_y]
            );
            res.status(201).json(rows[0]);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'Ocorreu um erro desconhecido' });
            }
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
