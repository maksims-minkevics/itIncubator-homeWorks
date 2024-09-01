import {Video} from "../ObjectTypes";
import {VideoDataValidation} from "../dataValidations/videoDataValidation";

const videos:Video[] = [
    {
        id: 0,
        title: "My First video",
        author: "MM",
        canBeDownloaded: true,
        minAgeRestriction: NaN,
        createdAt: "2024-05-17T21:23:49.724Z",
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144", "P240", "P360", "P480"],
    },
    {
        id: 1,
        title: "NodeJs training",
        author: "MM",
        canBeDownloaded: false,
        minAgeRestriction: NaN,
        createdAt: new Date().toISOString(),
        publicationDate: (new Date().toISOString()),
        availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    },
    {
        id: 2,
        title: "React training",
        author: "MM",
        canBeDownloaded: false,
        minAgeRestriction: 12,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    }
]

class videoDBHandlerClass {

    findVideo(id: number): Video;
    findVideo(): Video[];
    findVideo(id?: number): Video | Video[] | undefined {

        if (id || id === 0 ) {
            return videos.filter(video => +video.id === id)[0];
        } else {
            return videos
        }

    };

    createVideo(video: Video): Video | VideoError[] {
        const validationErrors = new VideoDataValidation(video);
        validationErrors.validate();
        if (validationErrors.failedValidations.length != 0) {
            return validationErrors.failedValidations;
        }
        const creationDate = new Date();
        const publicationDate = new Date(new Date().setDate(creationDate.getDate() + 1));
        const newVideo : Video = {
            id: +videos.length,
            title: video.title,
            author: video.author,
            canBeDownloaded: video.canBeDownloaded || false,
            minAgeRestriction: video.minAgeRestriction || NaN,
            createdAt: creationDate.toISOString(),
            publicationDate: video.publicationDate || publicationDate.toISOString(),
            availableResolutions: video.availableResolutions || [],
        }
        videos.push(newVideo);
        return newVideo;
    };

    updateVideo(id: number, fieldsToUpdate: Video): Video | undefined | VideoError[]{
        if (isNaN(id)) {
            return undefined;
        }

        const validationErrors = new VideoDataValidation(fieldsToUpdate);
        validationErrors.validate();

        if (validationErrors.failedValidations.length) {
            console.log('callled')
            return validationErrors.failedValidations;
        }
        const videoToUpdate = this.findVideo(id);
        if (!videoToUpdate) {
            return undefined;
        }

        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate[key as keyof Video] !== undefined) {
                (videoToUpdate[key as keyof Video] as any) = fieldsToUpdate[key as keyof Video];
            }
        }

        return videoToUpdate;
    }

    deleteVideo(id: number): number | undefined {
        if (isNaN(id)) {
            return undefined;
        }

        const videoToDelete = this.findVideo(id);
        if (!videoToDelete) {
            return undefined;
        }
        videos.splice(videoToDelete.id, 1);
        return id;
    }
}
export {videoDBHandlerClass}
