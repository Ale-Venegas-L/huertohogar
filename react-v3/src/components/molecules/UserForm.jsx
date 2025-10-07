import React, {useState} from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import {runValidator, validarCorreo, bdayValidator} from "../../utils/script";
import {addUser} from "../../services/firestoreService"
import {useHistory} from "react-router";

const UserForm = () => {
    const [form, setForm] = useState({run:"", nombre:"", correo:"", clave:"", fecha:""});
    const [msg, setMsg] = useState("");
    const history = useHistory();

    const handleChange = e => setForm({...form, [e.target.id]:e.target.value});
    const handleSubmit = async e => {
        e.preventDefault();
        const {run, nombre, correo, clave, fecha} = form;
        if(!runValidator(run)) return setMsg("RUN incorrecto");
        if(!nombre) return setMsg("Nombre vacío");
        if(!validarCorreo(correo)) return setMsg("Correo incorrecto");
        if(!bdayValidator(fecha)) return setMsg("Debe ser mayor de edad");

        await addUser(form);
        setMsg("Formulario enviado")
        setTimeout(() => {
            history.push(correo === "admin@duoc.cl" ? "/perfil-admin?nombre="+nombre : "/perfil-cliente?nombre="+nombre);
        }, 1000);
    };

    return(
         <form onSubmit={handleSubmit}>
            <Input id="run" label="RUN" value={form.run} required/>
            <Input id="nombre" label="Nombre" value={form.nombre} required/>
            <Input id="correo" label="Correo" type="email" value={form.correo} required/>
            <Input id="clave" label="Clave" type="password" value={form.clave} required/>
            <Input id="fecha" label="Fecha de Nacimiento" type="date" value={form.fecha} required/>
            <Button type="submit">Enviar</Button>
         </form>
    )
}

export default UserForm;