export function errorHandler(error, req, res, next) {

    const status = error.status || 500;

    return res.status(status).json({
        status: "error",
        message: error.message || "Error interno del servidor"
    });
}