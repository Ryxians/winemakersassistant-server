import {Application, Request, Response} from "express";
import bcrypt from 'bcrypt';
import {Connection} from "typeorm";
import {User} from "../database/entities/User";
import {isAdmin} from "../middleware/isAuth";

interface Args {
    app: Application
    connection: Connection
}

export const CreateUser = ({app, connection}: Args): void => {
    // Create a root users if one isn't already present.
    const initRoot = async () => {
        let count = await connection.getRepository(User).count();

        // If count is 0 then a root users needs to be declared.
        // Username: root
        // Password: root
        if (count === 0) {
            let root = new User();
            root.username = 'root';
            root.password = await bcrypt.hash('root', 10);
            root.active = true;
            root.role = 1;
            await connection.manager.save(root).then(() => {
                console.log("Root Created with default login (root/root). " +
                    "\nCHANGE IMMEDIATELY!")
            })
        }
    }
    initRoot().then();

    // Post new users to users
    app.post('/users/new', isAdmin, (async (req: Request, res: Response, next) => {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            // Create the new User
            let user = new User();
            // Set the new users to the information present.
            user.username = req.body.username;
            if (user.username === "" || user.username === " ") {
                res.status(400).send();
                return;
            } else {
                user.password = hashedPassword;
                user.role = req.body.role;
                user.active = true;
                await connection.manager.save(user).then(usr => {
                        res.statusMessage = usr.username + " has been created!";
                        res.status(201).send();
                        next();
                    }
                )

            }
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    }));
}