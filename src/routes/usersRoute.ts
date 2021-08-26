import express from "express";
import logger from "winston";
import usersController from "../controllers/userController";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.send(await usersController.getUsersId());
    } catch (error) {
        logger.error(error);
        res.status(500).send();
        return;
    }
});

router.get("/:user_id", async (req, res) => {
    try {
        const user = await usersController.getUser(req.params.user_id);

        if (!user) {
            res.status(404).send();
            return;
        }

        res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500).send();
        return;
    }
});

export default router;