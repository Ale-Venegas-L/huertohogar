import {useLocation} from "react-router-dom";

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

const PerfilCliente = () => {
    const q = useQuery();
    return <h1> Bienvenido {q.get("nombre")}</h1>
}

export default PerfilCliente;