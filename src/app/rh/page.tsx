'use client'

import { Header } from "../components/header";
import { Title } from "../components/title";
import Image from 'next/image'

import { useRouter } from 'next/navigation'; // Importando o useRouter

import styles from './styles.module.scss';
import { api } from "../services/api";
import { getCookiesClient } from "@/lib/cookieClient";
import { useEffect, useState } from "react";

import { Eye, FileLock2, Trash2, UserRoundPen } from "lucide-react";

export default function Adm() {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [register, setRegister] = useState(false);

    const router = useRouter(); // Inicializando o hook useRouter

    useEffect(() => {

        const token = getCookiesClient();

        async function getUser() {
            try {
                const response = await api.get("/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                setLoading(true)
                console.log(response.data)
            } catch (error) {
                console.error("Erro ao carregar o usuário:", error);
            }
        }



        getUser();
    }, [register])

    // Função para redirecionar para a página de signup
    const handleAddNewUser = () => {
        router.push('/rh/signup');
    };

    // Função para redirecionar para a página de profile
    const handleViewProfile = (userId: string) => {
        router.push(`/rh/perfil/${userId}`);
    };

    // Função para redirecionar para a página de profile
    const handleActiveUser = async (userId: string) => {
        try {
            const token = getCookiesClient();

            const response = await api.post("/users/edit",{
                user_id: userId
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRegister(!register)

        } catch (error) {
            console.error("Erro ao carregar o usuário:", error);
        }
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
                    <div className={styles.tabela}>

                        <button onClick={handleAddNewUser}>
                            Adicionar um novo
                        </button>


                        <div className={styles.tabelaheader}>
                            <p className={styles.rowNome}>Nome</p>
                            <p className={styles.rowTipo}>Equipe</p>
                            <p className={styles.rowTipo}>Modalidade</p>
                            <p className={styles.rowTipo}>Contrato</p>
                            <p className={styles.rowAtivo}>Status</p>
                            <p className={styles.rowbtn}>Ações</p>
                        </div>

                        {loading ? (user && user.map((item: any) => <div className={styles.tabelarow}>
                            <div className={styles.rowNome}>
                                <Image
                                    alt="Logo Sujeito Pizza"
                                    src={item.profilePhoto}
                                    width={45}
                                    height={45}
                                    priority={true}
                                    quality={100}
                                    className={styles.imgPerson}
                                />
                                <p>{item.name}</p>
                            </div>
                            <p className={styles.rowTipo}>{item.role}</p>
                            <p className={styles.rowTipo}>{item.Modality}</p>
                            <p className={styles.rowTipo}>{item.contrato}</p>
                            <p className={styles.rowAtivo}>{item.active ? "Ativo" : "Dasativo"}</p>
                            <div className={styles.rowbtn}>
                                <Eye size={24} color="#FFFF" style={{ cursor: 'pointer' }} onClick={() => handleViewProfile(item.id)} />
                                <FileLock2 size={24} color="#FFFF" style={{ cursor: 'pointer' }} onClick={() => handleActiveUser(item.id)}/>
                            </div>
                        </div>)) : <></>}

                    </div>
                </div>
            </main >
        </div >
    );
}
