import {BodyModule} from "../bodyModule";
import {Router} from "express";
import {createDb} from "../db";
import {videosObject} from "../dbObjects/videoDbObject";
export const videoRouter = Router({});

videoRouter.get("/", (req, resp) => {
    resp
        .status(200)
        .json(videosObject.findVideo())
})
videoRouter.get("/:id", (req, resp) => {
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .sendStatus(400)
        return;
    }

    const video = videosObject.findVideo(videoId);

    if (video.length === 0){
        resp
            .sendStatus(404)
        return;
    }

    return resp
        .status(200)
        .json(video[0])

})
videoRouter.delete("/:id", (req, resp) =>{
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .sendStatus(400)
        return;
    }
    const deletedVideo = videosObject.deleteVideo(videoId);

    if (deletedVideo.length === 0 ){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .sendStatus(204)

})
videoRouter.put("/:id", (req, resp) =>{
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .sendStatus(400)
        return;
    }

    const bodyModule = new BodyModule(req.body)
    const failedFields = bodyModule.validate()

    if (failedFields.length !== 0){
        resp
            .status(400)
            .json({"errorsMessages": failedFields})
        return;
    }

    const video = videosObject.findVideo(videoId);

    if (video.length === 0){
        resp
            .sendStatus(404)
        return;
    }

    bodyModule.updateFromBody(video[0]);
    resp
        .sendStatus(204)

})
videoRouter.post("/", (req, resp) =>{
    const bodyModule = new BodyModule(req.body)
    const failedFields = bodyModule.validate()

    if (failedFields.length !== 0){
        resp
            .status(400)
            .json({"errorsMessages": failedFields})
        return;
    }

    const video = bodyModule.getNewVideoRecord(db.videos);
    // @ts-ignore
    db.videos.push(video);

    resp
        .status(201)
        .json(video)
})