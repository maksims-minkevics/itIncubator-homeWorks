import express from 'express';
import {SETTINGS} from "./settings";
import {createDb} from "./db";
import {BodyModule} from "./bodyModule"


export const app = express()
export const {videos} = createDb();

const jsonBodyMiddleWare = express.json()
app.use(jsonBodyMiddleWare)

type Request = {
    "id": number,
    "title": "string",
    "author": "string",
    "canBeDownloaded": boolean,
    "minAgeRestriction": number ,
    "createdAt": Date,
    "publicationDate": Date,
    "availableResolutions": []
};
type Response = {
            "id": number,
            "title": "string",
            "author": "string",
            "canBeDownloaded": boolean,
            "minAgeRestriction": number,
            "createdAt": Date,
            "publicationDate": Date,
            "availableResolutions": []
};

app.get(SETTINGS.BASE_URL + "videos/", (req, resp) => {
    resp
        .status(200)
        .json(videos)
})

app.get(SETTINGS.BASE_URL + "videos/:id", (req, resp) => {
    const videoId = +req.params.id;

    if (isNaN(videoId)){
        resp
            .status(404);
        return
    }

    const video = videos.filter( (video) => video.id === +videoId)

    if (video.length === 0){
        resp
            .status(404)
        return;
    }

    return resp
        .status(200)
        .json(video[0])

})

app.delete(SETTINGS.BASE_URL + "videos/:id", (req, resp) =>{
    const videoId = +req.params.id;
    let video = undefined;

    if (isNaN(videoId)){
        resp
            .status(404)
        return;
    }

    for(let i = 0; i < videos.length; i++){
        if ( +videoId === videos[i].id){
            video = videos.splice(i, 1);
            break;
        }
    }

    if (!video){
        resp
            .sendStatus(404)
        return;
    }
    resp
        .sendStatus(204)

})

app.put(SETTINGS.BASE_URL + "videos/:id", (req, resp) =>{
    const videoId = +req.params.id;
    const bodyModule = new BodyModule(req.body)
    const failedFields = bodyModule.validate()

    if (failedFields.length !== 0){
        resp
            .status(400)
            .json({"errorsMessages": failedFields})
        return;
    }

    if (isNaN(videoId)){
        resp
            .sendStatus(404)
        return;
    }

    const video = videos.filter( (video) => video.id === videoId)

    if (video.length === 0){
        resp
            .sendStatus(404)
        return;
    }

    bodyModule.updateFromBody(video[0]);
    resp
        .sendStatus(204)

})

app.post(SETTINGS.BASE_URL + "videos/", (req, resp) =>{

    const bodyModule = new BodyModule(req.body)
    const failedFields = bodyModule.validate()

    if (failedFields.length !== 0){
        resp
            .status(400)
            .json({"errorsMessages": failedFields})
        return;
    }

    const video = bodyModule.getNewVideoRecord(videos);
    // @ts-ignore
    videos.push(video);

    resp
        .status(204)
        .json(video)
})