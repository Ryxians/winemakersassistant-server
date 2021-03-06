import {Application} from "express";
import {Connection, EntityTarget} from "typeorm";
import {User} from "../../database/entities/User";
import {ns} from "../CreateDatabasePosts";

interface Args {
    app:Application
    connection:Connection
}



export function CreateGetPost<Entity extends ns>(obj:EntityTarget<Entity>, path:string, {app, connection}:Args, isBlend?:boolean) {
    // Get all the specified entities of a batch
    app.get(`/wine/get/${path}/:batchid`, async (req, res, next) => {
        // Declare the new wine object and get the details from the request
        const {params} = req;

        isBlend = isBlend ? isBlend : false;

        let nsList;

        if (isBlend) {
            nsList = await connection.manager.find(obj, {where: {blend_id: params.batchid}});
        } else {
            nsList = await connection.manager.find(obj, {where: {batch_id: params.batchid}});
        }

        if (nsList[0]?.user_id) {
            for (const s of nsList) {
                s.bottleTeam = await connection.manager.findOne(User, {where: {id: s.user_id}});
            }
        }

        res.status(nsList ? 200 : 400).send(JSON.stringify(nsList));
    });
}