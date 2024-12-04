'use client'

import Image from "next/image"
import Link from "next/link"
import styles from '../../page.module.scss'
// import LogoImg from '/Logo.svg'
import { api } from "../../services/api"
import { redirect } from "next/navigation"
import { useState, ChangeEvent } from "react"

export default function Signup() {

    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("")
    const [loading, setLoading] = useState<boolean>(false);

    async function handleRegister(formData: FormData) {
        
        setLoading(!loading)

        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")
        const phoneNumber = formData.get("phoneNumber")
        const role = formData.get("role")
        const modality = formData.get("modality")
        const contrato = formData.get("contrato")
        const cidade = formData.get("cidade")
        const nascimento = formData.get("nascimento")
        const RG = formData.get("RG")
        const CPF = formData.get("CPF")

        if (name === "" || email === "" || password === "" || phoneNumber === "" || role === "") {
            console.log("Preencha todos os campos")
            return
        }

        const data = new FormData()

        data.append("name", name as string)
        data.append("email", email as string)
        data.append("password", password as string)
        data.append("phoneNumber", phoneNumber as string)
        data.append("role", role as string)
        data.append("Modality", modality as string)
        data.append("contrato", contrato as string)
        data.append("cidade", cidade as string)
        data.append("nascimento", nascimento as string)
        data.append("RG", RG as string)
        data.append("CPF", CPF as string)
        data.append("photourl", image as any)

        console.log(data)

        try {
            await api.post("/users", data)
        } catch (err) {
            console.log("error: ", err)
        }

        redirect("/rh")
    }


    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type !== "image/jpeg" && image.type !== "image/png") {
                return;
            }

            setImage(image);
            setPreviewImage(URL.createObjectURL(image))

        }
    }

    return (
        <>
            <div className={styles.containerCenter}>
                <Image
                    src={"/logo.svg"}
                    alt="Logo da empresa"
                    className={styles.logo}
                    width={700}
                    height={80}
                />

                <section className={styles.login}>
                    <form action={handleRegister}>
                        <input
                            type="text"
                            required
                            name="name"
                            placeholder="Digite seu nome"
                            className={styles.input}
                        />

                        <input
                            type="email"
                            required
                            name="email"
                            placeholder="Digite seu email"
                            className={styles.input}
                        />

                        <input
                            type="password"
                            required
                            name="password"
                            placeholder="Escolha a sua senha"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="phoneNumber"
                            placeholder="Número"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="role"
                            placeholder="Cargo"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="modality"
                            placeholder="Modalidade"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="cidade"
                            placeholder="Cidade"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="contrato"
                            placeholder="Tipo de contrato"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="nascimento"
                            placeholder="Data de nascimento"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="CPF"
                            placeholder="CPF"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            required
                            name="RG"
                            placeholder="RG"
                            className={styles.input}
                        />
                        <label className={styles.labelImage}>
                            <p>Escolha uma foto: <br /></p>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                name="photourl"
                                onChange={handleFile}
                                required
                            />
                        </label>

                        <button type="submit">
                            Criar conta
                        </button>
                    </form>

                    {/* <Link href="/" className={styles.text}>
                        Já possui uma conta? Faça login.
                    </Link> */}
                </section>
            </div>
        </>
    )
}