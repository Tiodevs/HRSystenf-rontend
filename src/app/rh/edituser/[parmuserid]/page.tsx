'use client';

import Image from 'next/image';
import styles from '../../../page.module.scss';
import { api } from '../../../services/api';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, useEffect } from 'react';
import { getCookiesClient } from '@/lib/cookieClient';

interface Props {
  params: {
    parmuserid: string;
  };
}

export default function EditUser({ params }: Props) {
  const decodedId = decodeURIComponent(params.parmuserid as string).trim();
  const router = useRouter();

  const [user, setUser] = useState<any>({
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
    Modality: '',
    contrato: '',
    cidade: '',
    nascimento: '',
    CPF: '',
    RG: '',
    user_id: decodedId,
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = getCookiesClient();

    async function getUser() {
      try {
        const resallUser = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const resUser = resallUser.data;

        const filterUser = resUser.filter((item: any) => item.id === decodedId);

        if (filterUser.length > 0) {
          setUser({
            name: filterUser[0].name || '',
            email: filterUser[0].email || '',
            phoneNumber: filterUser[0].phoneNumber || '',
            role: filterUser[0].role || '',
            Modality: filterUser[0].Modality || '',
            contrato: filterUser[0].contrato || '',
            cidade: filterUser[0].cidade || '',
            nascimento: filterUser[0].nascimento || '',
            CPF: filterUser[0].CPF || '',
            RG: filterUser[0].RG || '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar o usuário:', error);
      }
    }

    getUser();
  }, [decodedId]);

  async function handleRegister(formData: FormData) {
    setLoading(true);
  
    const token = getCookiesClient();
  
    if (!token) {
      alert('Sessão expirada. Por favor, faça login novamente.');
      setLoading(false);
      return;
    }
  
    // Converte FormData em JSON e adiciona o ID
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.user_id = decodedId; // Garante que o ID está no corpo
  
    console.log('Dados enviados ao backend:', data); // Log para depuração
  
    try {
      // Envia a requisição com o ID no corpo
      await api.post('/users/edit/all', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      router.push('/rh'); // Redireciona após o sucesso
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      alert('Erro ao atualizar usuário. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }
  

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prev: any) => ({ ...prev, [name]: value }));
  }

  return (
    <div className={styles.containerCenter}>
      <Image
        src={'/logo.svg'}
        alt="Logo da empresa"
        className={styles.logo}
        width={700}
        height={80}
      />

      <section className={styles.login}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister(new FormData(e.target as HTMLFormElement));
          }}
        >
          <input
            type="text"
            required
            name="name"
            placeholder="Digite seu nome"
            className={styles.input}
            value={user.name}
            onChange={handleInputChange}
          />

          <input
            type="email"
            required
            name="email"
            placeholder="Digite seu email"
            className={styles.input}
            value={user.email}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="phoneNumber"
            placeholder="Número"
            className={styles.input}
            value={user.phoneNumber}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="role"
            placeholder="Cargo"
            className={styles.input}
            value={user.role}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="modality"
            placeholder="Modalidade"
            className={styles.input}
            value={user.Modality}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="cidade"
            placeholder="Cidade"
            className={styles.input}
            value={user.cidade}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="contrato"
            placeholder="Tipo de contrato"
            className={styles.input}
            value={user.contrato}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="nascimento"
            placeholder="Data de nascimento"
            className={styles.input}
            value={user.nascimento}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="CPF"
            placeholder="CPF"
            className={styles.input}
            value={user.CPF}
            onChange={handleInputChange}
          />

          <input
            type="text"
            required
            name="RG"
            placeholder="RG"
            className={styles.input}
            value={user.RG}
            onChange={handleInputChange}
          />



          <button type="submit">Salvar Alterações</button>
        </form>
      </section>
    </div>
  );
}
