'use client'

import { Header } from "../components/header";
import { Title } from "../components/title";
import Image from 'next/image'

import styles from './styles.module.scss';
import { api } from "../services/api";
import { getCookiesClient } from "@/lib/cookieClient";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'; // Importando a biblioteca Day.js
import { title } from "process";

export default function Adm() {

    const [user, setUser] = useState<any>(null);
    const [events, setEvents] = useState<any>(null);
    const [urlUser, setUrlUser] = useState("");
    const [loading, setLoading] = useState(false);
    const [register, setRegister] = useState(false);


    useEffect(() => {
        const token = getCookiesClient();
      
        async function getUser() {
          try {
            const response = await api.get("/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            const userData = response.data; // Dados do usuário
            setUser(userData);
      
            const events = await api.get("/presenceday", {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            const eventsfilter = events.data.filter((item: any) => item.user.id === userData.id); // Use userData diretamente
            setEvents(eventsfilter);

            console.log('Usuário carregado:', user);
            console.log('Eventos carregados:', events.data);
      
            setLoading(true);
          } catch (error) {
            console.error("Erro ao carregar o usuário:", error);
          }
        }
      
        getUser();
      }, [register]);

    console.log(user)

    // Função para formatar a data
    const formatDate = (date: string) => {
        return dayjs(date).format('DD/MM/YY - hh:mm A'); // Exemplo: 17/10/24 - 03:30 PM
    };

    async function handleRegister(formData: FormData) {

        const type = formData.get("type")
        const description = formData.get("description")
        const data = formData.get("data")
        const name = formData.get("name")

        const token = getCookiesClient();

        if (!type) {
            console.log("Selecione um tipo de entrada");
            return;
        }
        if (!name) {
            console.log("Nome não selecionado");
            return;
        }
        if (!description) {
            console.log("Descrição não selecionado");
            return;
        }
        if (!data) {
            console.log("Data não selecionado");
            return;
        }

        try {
            await api.post("/presenceday", {
                userId: user.id,
                type: type,
                day: data,
                description: description,
                title: title
            }, {
                headers: { Authorization: `Bearer ${token}` },
            })

            setRegister(!register);
        } catch (err) {
            console.log("error: ", err)
        }


    }

    return (
        <div>
            <main className={styles.main}>
                <Header />
                <div className={styles.content}>
                    <Title
                        name01="Veja todos os seus eventos e escala aqui"
                        name02="Calendário"
                    />
                    <div className={styles.tabela}>

                        {user &&
                            <form action={handleRegister}>

                                <input name="name" placeholder="Nome" type="text" className={styles.input}/>

                                <select name="type" required className={styles.select}>
                                    <option  value="">Selecione um tipo</option>
                                    <option value="Começo">Presencial</option>
                                    <option value="Começo">Híbrido</option>
                                    <option value="Começo">Remoto</option>
                                </select>

                                <input name="data" placeholder="Data" type="date" className={styles.input}/>

                                <input name="description" placeholder="Descrição" type="text" className={styles.input}/>

                                <button type="submit">
                                    Adicionar
                                </button>

                            </form>}



                        <div className={styles.tabelaheader}>
                            <p className={styles.rowNome}>Nome</p>
                            <p className={styles.rowTipo}>Tipo</p>
                            <p className={styles.rowTipo}>Data</p>
                            <p className={styles.rowTipo}>Descrição</p>
                        </div>

                        {loading ? (events && events.map((item: any) => <div className={styles.tabelarow}>
                            <div className={styles.rowNome}>
                                <p>{item.user.name}</p>
                            </div>
                            <p className={styles.rowTipo}>{item.type}</p>
                            <p className={styles.rowTipo}>{formatDate(item.day)}</p>
                            <p className={styles.rowTipo}>{item.description}</p>
                        </div>)) : <></>}

                    </div>
                </div>
            </main >
        </div >
    );
}
