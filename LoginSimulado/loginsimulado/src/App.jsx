import React, { useState, useEffect } from "react"; // Importamos React y los hooks necesarios

// Simulacion de un usuario para la validación de login
const USUARIO_VALIDO = {
    username: "usuario1",
    password: "123456",
};

// Simulacion de API protegida que devuelve los datos del usuario tras iniciar sesión
const obtenerDatosUsuario = async () => {
    return new Promise((resolve) => {
        // Simulacion de un retraso de 2 segundos como si consultáramos a un servidor real
        setTimeout(() => {
            resolve({
                nombre: "Esteban Guaña",
                email: "esteban.guana@uisek.edu.ec",
            });
        }, 2000);
    });
};

function App() {
    //  Estados para controlar el formulario y la aplicación
    const [usuario, setUsuario] = useState("");          // Campo de nombre de usuario
    const [clave, setClave] = useState("");              // Campo de contraseña
    const [cargando, setCargando] = useState(false);     // Controla el estado de "Cargando..."
    const [error, setError] = useState("");              // Guarda y muestra mensajes de error
    const [perfil, setPerfil] = useState(null);          // Guarda los datos del usuario al iniciar sesión
    const [intentos, setIntentos] = useState(0);         // Cuenta los intentos fallidos
    const [bloqueado, setBloqueado] = useState(false);   // Indica si el acceso está temporalmente bloqueado

    // useEffect para ocultar automáticamente los mensajes de error después de 3 segundos
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000); // Limpia el error después de 3 seg.
            return () => clearTimeout(timer);
        }
    }, [error]);

    // useEffect para bloquear el acceso después de 3 intentos fallidos
    useEffect(() => {
        if (intentos >= 3) {
            setBloqueado(true); // Bloqueamos el botón
            setError("❌ Demasiados intentos. Bloqueado por 10 segundos.");

            // Después de 10 segundos, Se desbrloquea e inicia sesion
            const timer = setTimeout(() => {
                setIntentos(0);         // Reiniciamos los intentos
                setBloqueado(false);    // Quitamos el bloqueo
                setError("");           // Limpiamos mensaje
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [intentos]);

    // Función que maneja el evento de "Iniciar Sesión"
    const manejarLogin = async (e) => {
        e.preventDefault();     // Prevenimos que se recargue la página
        setError("");           // Limpiamos errores anteriores
        setPerfil(null);        // Reseteamos el perfil por si ya estaba logueado

        // Validamos que los campos no estén vacíos
        if (!usuario || !clave) {
            setError("⚠️ Llena todos los campos.");
            return;
        }

        // Si está bloqueado, mostramos mensaje y no permitimos continuar
        if (bloqueado) {
            setError("⛔ Acceso bloqueado. Espera unos segundos.");
            return;
        }

        // Validamos las credenciales ingresadas
        if (usuario === USUARIO_VALIDO.username && clave === USUARIO_VALIDO.password) {
            setCargando(true); // Mostramos mensaje de carga

            try {
                // Obtenemos los datos del usuario (simulado)
                const datos = await obtenerDatosUsuario();
                setPerfil(datos); // Guardamos el perfil en el estado
            } catch (err) {
                setError("❌ Error al obtener datos."); // En caso de error en la API simulada
            } finally {
                setCargando(false); // Quitamos mensaje de carga
                setIntentos(0);     // Reiniciamos los intentos fallidos
            }
        } else {
            // Si las credenciales son incorrectas, aumentamos el contador y mostramos error
            setIntentos((prev) => prev + 1);
            setError("❌ Credenciales incorrectas.");
        }
    };

    // Renderizado del componente principal
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white shadow-lg rounded-xl w-full max-w-sm">
                {/* Si no hay perfil, mostramos el formulario */}
                {!perfil ? (
                    <form onSubmit={manejarLogin}>
                        <h1 className="text-xl font-bold mb-4"> 🔐 Iniciar Sesión</h1>

                        <input
                            type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full mb-3 px-4 py-2 border rounded"
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            className="w-full mb-3 px-4 py-2 border rounded"
                        />

                        {/* Botón que se desactiva si el acceso está bloqueado */}
                        <button
                            type="submit"
                            className={`w-full text-white py-2 rounded ${bloqueado ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                            disabled={bloqueado}
                        >
                            Ingresar
                        </button>

                        {/* Mensajes de carga y error */}
                        {cargando && <p className="mt-3 text-yellow-600">⏳ Cargando datos...</p>}
                        {error && <p className="mt-3 text-red-500">{error}</p>}
                    </form>
                ) : (
                    // Si hay perfil, mostramos los datos del usuario
                    <div>
                        <h1 className="text-xl font-bold mb-4">✅ Bienvenido/a</h1>
                        <p><strong>Nombre:</strong> {perfil.nombre}</p>
                        <p><strong>Email:</strong> {perfil.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App; // Exportamos el componente principal
