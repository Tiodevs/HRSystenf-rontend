"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
import Image from 'next/image'

import { usePathname } from "next/navigation";
// import logoImg from '/public/Logo.svg'
import { BellElectric, BookUser, Calendar, LogOutIcon } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getCookiesClient } from '@/lib/cookieClient';
import { api } from '@/app/services/api';
import { useEffect, useState } from 'react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [urlUser, setUrlUser] = useState("");

  const router = useRouter();

  // Verifica se a rota é ativa
  const pathname = usePathname(); // Pega a rota ativa
  const isActive = (path: string) => pathname.startsWith(path);

  async function handleLogout() {
    deleteCookie("session", { path: "/" })
    toast.success("Logout feito com sucesso!")

    router.replace("/")
  }

  useEffect(() => {
    const token = getCookiesClient();

    async function getUser() {
      try {
        const response = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrlUser(response.data.profilePhoto);
        setUser(response.data);
      } catch (error) {
        console.error("Erro ao carregar o usuário:", error);
        handleLogout(); // Redireciona se houver erro
      }
    }

    getUser();
  }, []);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div>
        </div>
        <Link href="/attendence">
          <Image
            alt="Logo Sujeito Pizza"
            src={"/logo.svg"}
            width={200}
            height={54}
            priority={true}
            quality={100}
          />
        </Link>

        <nav>
          {/* Rota privada */}
          {user && user.role === "RH" && <Link className={isActive("/rh") ? styles.active : styles.link} href="/rh">
            <BookUser size={24} color="#FFFF" />
            <p>Equipe</p>
          </Link>}

          <Link className={isActive("/calendar") ? styles.active : styles.link} href="/calendar">
            <Calendar size={24} color="#FFFF" />
            <p>Calendário</p>
          </Link>

          <Link className={isActive("/attendence") ? styles.active : styles.link} href="/attendence">
            <BellElectric size={24} color="#FFFF" />
            <p>Registo</p>
          </Link>

          <button className={styles.link} onClick={() => handleLogout()}>
            <LogOutIcon size={24} color="#FFFF" />
            <p>Sair da conta</p>
          </button>

        </nav>


      </div>

      {user && <Link href={`/rh/perfil/${user.id}`}>

        <div className={styles.user}>
          <Image
            alt="Logo Sujeito Pizza"
            src={urlUser}
            width={45}
            height={45}
            priority={true}
            quality={100}
            className={styles.imgPerson}
          />

          <div><h1>{user.name}</h1><p>{user.role}</p></div>
        </div>
      </Link>}

    </header>
  )
}