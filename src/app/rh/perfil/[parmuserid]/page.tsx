'use client'

import { Header } from "../../../components/header";
import { Title } from "../../../components/title";
import Image from 'next/image'

import { useRouter } from 'next/navigation'; // Importando o useRouter

import styles from './styles.module.scss';
import { api } from "../../../services/api";
import { getCookiesClient } from "@/lib/cookieClient";
import { useEffect, useState } from "react";

import dayjs from 'dayjs'; // Importando a biblioteca Day.js

interface Props {
    params: {
        parmuserid: string
    }
}

export default function Profile({ params }: Props) {

    const decodedId = decodeURIComponent(params.parmuserid as string).trim()

    console.log("Parms", decodedId)
    const [user, setUser] = useState<any>(null);
    const [attendence, setAttendence] = useState<any>(null);
    const [urlUser, setUrlUser] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter(); // Inicializando o hook useRouter

    useEffect(() => {

        const token = getCookiesClient();

        async function getUser() {
            try {
                const resallUser = await api.get("/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const resUser = resallUser.data

                const filteruser = resUser.filter((item: any) => item.id === decodedId)

                const resAttendance = await api.post("/attendance/time", {
                    userId: filteruser[0].id,
                    contract: filteruser[0].contrato
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                setAttendence(resAttendance.data)

                setUrlUser(filteruser[0].profilePhoto);
                console.log(filteruser[0])
                setUser(filteruser[0]);

                console.log(filteruser)
            } catch (error) {
                console.error("Erro ao carregar o usuário:", error);
            }
        }



        getUser();
    }, [])

    // Função para redirecionar para a página de signup
    const handleEditUser = () => {
        router.push(`/rh/edituser/${decodedId}`);
    };

    // Função para formatar a data
    const formatDate = (date: string) => {
        return dayjs(date).format('DD/MM/YY - hh:mm A'); // Exemplo: 17/10/24 - 03:30 PM
    };


    return (
        <div>
            <main className={styles.main}>
                <Header />
                <div className={styles.content}>
                    <Title
                        name01="Adicione, remova e edite informações"
                        name02="Toda a esquipe"
                    />
                    {user && <div className={styles.tabela}>
                        <div className={styles.rowheader}>
                            <div>
                                <Image
                                    alt="Logo Sujeito Pizza"
                                    src={urlUser}
                                    width={127}
                                    height={127}
                                    priority={true}
                                    quality={100}
                                    className={styles.imgPerson}
                                />
                                <div>
                                    <h1>{user.name}</h1>
                                    <p>{user.role}</p>
                                </div>
                            </div>
                            <button onClick={handleEditUser}>
                                Editar perfil
                            </button>
                        </div>

                        <div className={styles.rowinfos}>
                            <div className={styles.cardinfo}>
                                <h2>Email</h2>
                                <p>{user.email}</p>
                            </div>

                            <div className={styles.cardinfo}>
                                <h2>Número</h2>
                                <p>{user.phoneNumber}</p>
                            </div>

                            <div className={styles.cardinfo}>
                                <h2>Status</h2>
                                <p>{user.active ? "Ativo" : "Desativado"}</p>
                            </div>
                            <div className={styles.cardinfo}>
                                <h2>Cidade</h2>
                                <p>{user.cidade}</p>
                            </div>
                            <div className={styles.cardinfo}>
                                <h2>Contrato</h2>
                                <p>{user.contrato}</p>
                            </div>
                            <div className={styles.cardinfo}>
                                <h2>Data de nascimento</h2>
                                <p>{user.nascimento}</p>
                            </div>
                            <div className={styles.cardinfo}>
                                <h2>RG</h2>
                                <p>{user.RG}</p>
                            </div>
                            <div className={styles.cardinfo}>
                                <h2>CPF</h2>
                                <p>{user.CPF}</p>
                            </div>
                            <div className={styles.cardinfo}>
                                <h2>Modality</h2>
                                <p>{user.Modality}</p>
                            </div>
                        </div>

                        <div className={styles.rowinfos}>
                            <div>
                                <h2>Quantidade de horas trabalhas nos ultimos 30 dias</h2>
                                <p>{attendence.totalHoras} horas e {attendence.totalMinutos} minutos</p>
                                {attendence.inconsistencias.length >= 1 && <p>Tem inconsistencias</p>}
                            </div>
                        </div>


                        <div className={styles.tabelaheader}>
                            <p className={styles.rowNome}>Nome</p>
                            <p className={styles.rowTipo}>Tipo</p>
                            <p className={styles.rowTime}>Horario</p>
                        </div>

                        {user && user.Attendance.map((item: any) => <div className={styles.tabelarow}>
                            <div className={styles.rowNome}>
                                <Image
                                    alt="Logo Sujeito Pizza"
                                    src={urlUser}
                                    width={45}
                                    height={45}
                                    priority={true}
                                    quality={100}
                                    className={styles.imgPerson}
                                />
                                <p>{user.name}</p>
                            </div>
                            <p className={styles.rowTipo}>{item.type}</p>
                            <p className={styles.rowTime}>{formatDate(item.createdAt)}</p>
                        </div>)}

                    </div>

                    }

                </div>
            </main >
        </div >
    );
}
