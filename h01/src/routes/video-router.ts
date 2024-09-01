import {Router} from "express";
import {createDb} from "../db";
import {videoDBHandlerClass} from "../dbObjects/videoDbObject";
import {VideoError} from "../ObjectTypes";
export const videoRouter = Router({});
const videoDBHandler = new videoDBHandlerClass();

videoRouter.get("/", (req, resp) => {
    resp
        .status(200)
        .json(videoDBHandler.findVideo())
})
videoRouter.get("/:id", (req, resp) => {
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .sendStatus(400)
        return;
    }

    const video = videoDBHandler.findVideo(videoId);

    if (!video){
        resp
            .sendStatus(404)
        return;
    }

    return resp
        .status(200)
        .json(video)

})
videoRouter.delete("/:id", (req, resp) =>{
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .sendStatus(400)
        return;
    }
    const deletedVideoId = videoDBHandler.deleteVideo(videoId);

    if (!deletedVideoId){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .status(200)
        .json(deletedVideoId)

})
videoRouter.put("/:id", (req, resp) =>{
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .sendStatus(400)
        return;
    }
    const updatedVideo = videoDBHandler.updateVideo(videoId, req.body);

    if(Array.isArray(updatedVideo)){
        resp
            .status(400)
            .json({"errorsMessages": updatedVideo})
        return;

    }

    if (!updatedVideo){
        resp
            .sendStatus(404)
        return;
    }
    console.log(updatedVideo)
    resp
        .status(200)
        .json(updatedVideo)

})
videoRouter.post("/", (req, resp) =>{
    const video = videoDBHandler.createVideo(req.body);

    if (Array.isArray(video)){
        resp
            .status(400)
            .json({"errorsMessages": video})
        return;
    }

    resp
        .status(201)
        .json(video)
})