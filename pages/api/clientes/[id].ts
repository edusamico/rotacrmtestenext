import { NextApiRequest, NextApiResponse } from 'next';
import pool from './db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
                if (rows.length > 0) {
                    res.status(200).json(rows[0]);
                } else {
                    res.status(404).json({ message: 'Cliente não encontrado.' });
                }
            } catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(500).json({ error: 'Ocorreu um erro desconhecido.' });
                }
            }
            break;
        case 'PUT':
            try {
                const { nome, email, telefone, coordenada_x, coordenada_y } = req.body;
                const { rows } = await pool.query(
                    'UPDATE clientes SET nome = $2, email = $3, telefone = $4, coordenada_x = $5, coordenada_y = $6 WHERE id = $1 RETURNING *',
                    [id, nome, email, telefone, coordenada_x, coordenada_y]
                );
                if (rows.length > 0) {
                    res.status(200).json(rows[0]);
                } else {
                    res.status(404).json({ message: 'Cliente não encontrado.' });
                }
            } catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(500).json({ error: 'Ocorreu um erro desconhecido.' });
                }
            }
            break;
        case 'DELETE':
            try {
                await pool.query('DELETE FROM clientes WHERE id = $1', [id]);
                res.status(200).json({ message: 'Cliente deletado com sucesso.' });
            } catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(500).json({ error: 'Ocorreu um erro desconhecido.' });
                }
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
