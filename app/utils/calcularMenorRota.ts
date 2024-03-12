import { Pool } from 'pg';

interface Cliente {
  id: number;
  nome: string;
  coordenada_x: number;
  coordenada_y: number;
}

interface Ponto {
  id: number | 'inicio' | 'fim';
  coordenada_x: number;
  coordenada_y: number;
}

function calcularDistancia(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

async function calcularMenorRota(pool: Pool): Promise<Ponto[]> {
  const clientes: Cliente[] = (await pool.query('SELECT id, nome, coordenada_x, coordenada_y FROM clientes')).rows;
  const visitados = new Set<number>();
  const rota: Ponto[] = [{ id: 'inicio', coordenada_x: 0, coordenada_y: 0 }];
  let ultimoVisitado: Ponto = rota[0];

  while (visitados.size < clientes.length) {
    let proximoCliente = null;
    let menorDistancia = Number.POSITIVE_INFINITY;

    clientes.forEach(cliente => {
      if (!visitados.has(cliente.id)) {
        const distancia = calcularDistancia(
          ultimoVisitado.coordenada_x,
          ultimoVisitado.coordenada_y,
          cliente.coordenada_x,
          cliente.coordenada_y
        );
        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          proximoCliente = cliente;
        }
      }
    });

    if (proximoCliente) {
      visitados.add((proximoCliente as Cliente).id);
      rota.push(proximoCliente);
      ultimoVisitado = proximoCliente;
    }
  }

  rota.push({ id: 'fim', coordenada_x: 0, coordenada_y: 0 });

  return rota;
}

export default calcularMenorRota;
