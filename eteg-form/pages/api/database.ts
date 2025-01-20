// pages/api/database.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

client.connect();

async function createTablesIfNotExist() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      cpf VARCHAR(11) PRIMARY KEY,
      nome_completo VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      cor_preferida VARCHAR(50) NOT NULL,
      observacao TEXT
    );
  `;

  await client.query(createTableQuery);
}

async function insertUserData(cpf: string, nomeCompleto: string, email: string, corPreferida: string, observacao?: string) {
  const cpfCleaned = cpf.replace(/\D/g, '')
  const insertQuery = `
    INSERT INTO public.usuarios (cpf, nome_completo, email, cor_preferida, observacao)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [cpfCleaned, nomeCompleto, email, corPreferida, observacao || null];

  try {
    await client.query(insertQuery, values);
    return { success: true, message: 'Formulário enviado com sucesso!' };
  } catch (error) {
    if ((error as {code: string}).code === '23505') {
      return { success: false, message: 'Usuário já cadastrado com esse CPF.' };
    } else {
      return { success: false, message: 'Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.' };
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cpf, nomeCompleto, email, corPreferida, observacao } = req.body;

    try {
      await createTablesIfNotExist();
      const result = await insertUserData(cpf, nomeCompleto, email, corPreferida, observacao);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: `Erro no servidor. Tente novamente mais tarde. ${
        (error as {message: string}).message}`
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Método não permitido.' });
  }
  return
}
