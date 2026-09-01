
export async function getAll (req, res, next){
    res.status(200).json({
        status: "success",
        payload: []
    });
}
