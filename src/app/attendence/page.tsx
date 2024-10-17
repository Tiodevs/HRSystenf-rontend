import { getCookiesServer } from "@/lib/cookieServer";
import { Header } from "../components/header";
import { Title } from "../components/title";
import Image from "next/image";

import styles from './styles.module.scss';
import { api } from "../services/api";

export default async function Adm() {

    const token = getCookiesServer();

    const users = await api.get('users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const resUsers = users.data;

    return (
        <div>

            <main className={styles.main}>
                <Header />
                <div className={styles.content}>
                    <Title
                        name01="Adicione, remova e edite informações"
                        name02="Toda a esquipe"
                    />
                    <div>
                        <p>Teste</p>
                    </div>
                    
                </div>
            </main >
        </div >
    );
}
