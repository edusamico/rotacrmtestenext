"use client"
import { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  coordenada_x: number;
  coordenada_y: number;
}

interface Rota {
  id: 'inicio' | 'fim' | number;
  coordenada_x: number;
  coordenada_y: number;
}

function formatarTelefone(telefone: any) {
  const numeros = telefone.replace(/\D/g, '');

  const comParenteses = numeros.replace(/(\d{2})(\d+)/, '($1) $2');

  return comParenteses.slice(0, 14);
}

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rota, setRota] = useState<Rota[]>([]);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', coordenada_x: 0, coordenada_y: 0 });
  const [filtro, setFiltro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);


  const clientesFiltrados = clientes.filter(cliente => {
    return cliente.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(filtro.toLowerCase()) ||
      cliente.telefone?.toLowerCase().includes(filtro.toLowerCase());
  });

  useEffect(() => {
    fetch('/api/clientes')
      .then(response => response.json())
      .then(data => setClientes(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: formatarTelefone(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(response => response.json())
      .then(data => {
        setClientes(prevClientes => [...prevClientes, data]);
        setForm({ nome: '', email: '', telefone: '', coordenada_x: 0, coordenada_y: 0 });
      })
      .catch(error => console.error('Erro ao cadastrar cliente:', error));
  };

  const handleCalculateRoute = () => {
    fetch('/api/calcular-rota')
      .then(response => response.json())
      .then(data => {
        setRota(data)
        setIsModalOpen(true)
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteCliente = async (id: number) => {
    try {
      await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
      });
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const handleStartEditCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
  };

  const handleCancelEdit = () => {
    setClienteEditando(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteEditando) {
      return
    }
    try {
      const response = await fetch(`/api/clientes/${clienteEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: clienteEditando.nome,
          email: clienteEditando.email,
          telefone: clienteEditando.telefone,
          coordenada_x: clienteEditando.coordenada_x,
          coordenada_y: clienteEditando.coordenada_y,
        }),
      });

      if (!response.ok) {
        throw new Error('Problema ao atualizar o cliente');
      }

      const updatedCliente = await response.json();
      setClientes(clientes.map(cliente => cliente.id === updatedCliente.id ? updatedCliente : cliente));
      setClienteEditando(null);
    } catch (error) {
      console.error('Falha ao salvar as edições:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Gerenciamento de Clientes</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Cadastrar Novo Cliente</h2>
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white shadow rounded-lg">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleInputChange}
            className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
          />
          <input
            type="text"
            name="telefone"
            placeholder="DDD + Telefone"
            value={form.telefone}
            onChange={handlePhoneInputChange}
            className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
            maxLength={14}
          />
          <input
            type="number"
            name="coordenada_x"
            placeholder="Coordenada X"
            value={form.coordenada_x}
            onChange={handleInputChange}
            className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
          />
          <input
            type="number"
            name="coordenada_y"
            placeholder="Coordenada Y"
            value={form.coordenada_y}
            onChange={handleInputChange}
            className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
          />
          <button type="submit" disabled={!form.nome || !form.email || !form.telefone ||
            !form.coordenada_x || !form.coordenada_y} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg w-full transition duration-200">
            Cadastrar
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Lista de Clientes</h2>
        <input
          type="text"
          placeholder="Filtrar por nome, e-mail ou telefone"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
        />
        <div className="mb-8 p-6 bg-white shadow rounded-lg">

          {clientesFiltrados.map(cliente => (
            <div key={cliente.id}
              className="mb-4 p-4 rounded border border-gray-200 shadow-sm bg-gray-50">
              <p>nome: {cliente.nome}</p>
              <p>email: {cliente.email}</p>
              <p>telefone: {cliente.telefone}</p>
              <div>
                <button
                  onClick={() => handleStartEditCliente(cliente)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCliente(cliente.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
          <div>
            <button
              onClick={handleCalculateRoute}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg w-full transition duration-200">
              Calcular Rota
            </button>
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded shadow-lg">
                  {rota.length > 0 && (
                    <div className="... suas classes tailwind ...">
                      <h2 className="text-xl font-semibold my-3">Rota Calculada</h2>
                      {rota.map((ponto, index) => (
                        <div key={index}>
                          {typeof ponto.id === 'number' ? (
                            <p>
                              {clientes.find(cliente => cliente.id === ponto.id)?.nome} - X: {ponto.coordenada_x}, Y: {ponto.coordenada_y}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={handleCloseModal} className="bg-red-500 text-white px-4 py-2 rounded">
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {
        clienteEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="bg-white p-6 rounded-lg shadow max-w-lg w-full"
              >
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={clienteEditando.nome}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, nome: e.target.value })}
                  className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={clienteEditando.email}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, email: e.target.value })}
                  className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
                  required
                />
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone"
                  value={clienteEditando.telefone}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, telefone: e.target.value })}
                  className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
                />
                <input
                  type="number"
                  name="coordenada_x"
                  placeholder="Coordenada X"
                  value={clienteEditando.coordenada_x.toString()}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, coordenada_x: parseFloat(e.target.value) })}
                  className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
                />
                <input
                  type="number"
                  name="coordenada_y"
                  placeholder="Coordenada Y"
                  value={clienteEditando.coordenada_y.toString()}
                  onChange={(e) => setClienteEditando({ ...clienteEditando, coordenada_y: parseFloat(e.target.value) })}
                  className="border-gray-300 p-3 mb-4 rounded-lg w-full text-gray-700 border-2"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    onClick={handleSaveEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Salvar Edições
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
}

