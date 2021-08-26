import express from "express";
import users from "../services/users";

const router = express.Router();

router.get("/", async (req, res) => {
    res.send(await users.getUsers());
});

router.get("/:user_id", async (req, res) => {
    const user = await users.getUser(req.params.user_id);

    if(!user) {
        res.statusCode = 404;
        res.send();
        return;
    }

    res.send(user);
});

export default router;