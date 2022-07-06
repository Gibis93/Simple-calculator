import { math } from "../utils/math.js";

export default function handler(req, res) {
    const request = JSON.parse(req.body);
    if (request.num === "0" && request.sign === "÷") {
        res.status(400);
        res.send({ error_message: "Can't divide by 0" });
    }
    const result = math(Number(request.res), Number(request.num), request.sign);
    res.status(200).json({
        response: result,
    });
}