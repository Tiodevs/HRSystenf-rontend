'use client'

import { Header } from "../components/header";
import { Title } from "../components/title";
import Image from 'next/image'

import styles from './styles.module.scss';
import { api } from "../services/api";
import { getCookiesClient } from "@/lib/cookieClient";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'; // Importando a biblioteca Day.js

export default function Adm() {

    const [user, setUser] = useState<any>(null);
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
                setUrlUser(response.data.profilePhoto);
                setUser(response.data);
                setLoading(true)
            } catch (error) {
                console.error("Erro ao carregar o usuário:", error);
            }
        }



        getUser();
    }, [register])

    console.log(user)

    // Função para formatar a data
    const formatDate = (date: string) => {
        return dayjs(date).format('DD/MM/YY - hh:mm A'); // Exemplo: 17/10/24 - 03:30 PM
    };

    async function handleRegister(formData: FormData) {

        const type = formData.get("type")

        const token = getCookiesClient();

        if (!type) {
            console.log("Selecione um tipo de entrada");
            return;
        }

        try {
            await api.post("/attendance", {
                userId: user.id,
                type: type
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

                                <input name="Nome" placeholder="Nome" type="text" className={styles.input}/>

                                <select name="type" required className={styles.select}>
                                    <option  value="">Selecione um tipo</option>
                                    <option value="Começo">Presencial</option>
                                    <option value="Começo">Híbrido</option>
                                    <option value="Começo">Remoto</option>
                                </select>

                                <input name="Data" placeholder="Data" type="date" className={styles.input}/>

                                <input name="Descrição" placeholder="Descrição" type="text" className={styles.input}/>

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

                        {loading ? (user && user.Attendance.map((item: any) => <div className={styles.tabelarow}>
                            <div className={styles.rowNome}>
                                <p>{user.name}</p>
                            </div>
                            <p className={styles.rowTipo}>{item.type}</p>
                            <p className={styles.rowTipo}>{formatDate(item.createdAt)}</p>
                            <p className={styles.rowTipo}>Teste</p>
                        </div>)) : <></>}

                    </div>
                </div>
            </main >
        </div >
    );
}
