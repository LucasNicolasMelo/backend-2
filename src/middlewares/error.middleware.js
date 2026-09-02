export function errorHandler(error, req, res, next) {
    if (error.status === 401 || error.name === "AuthenticationError") {
        return res.status(401).json({
            status: "error",
            message: error.message || "Credenciales inválidas"
        });
    }

    const status = error.status || 500;

    res.status(status).json({
        status: "error",
        message: error.message || "Error interno del servidor"
    });
}