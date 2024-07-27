const videos = [
    {
        id: 0,
        title: "My First video",
        author: "MM",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2024-05-17T21:23:49.724Z",
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144", "P240", "P360", "P480"],
    },
    {
        id: 1,
        title: "NodeJs training",
        author: "MM",
        canBeDownloaded: false,
        minAgeRestriction: null,
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
export const videosObject = {
    findVideo(id : number = NaN){
        if(id){
            let videosArray = videos.filter(video => video.id === id)
            return videosArray
        }
        else{
            return videos
        }

    },

    createVideo(){

    },

    updateVideo(id : number){
        for (const [key, value] of Object.entries(this.reqBody)) {
            if (!Object.keys(toUpdate).includes(key)){
                return;
            }

            if (this.reqBody[key] !== "" && this.reqBody[key] !== toUpdate[key]){
                toUpdate[key] = value;
            }

        }
        return toUpdate;

    },

    deleteVideo(id : number){
        const video = this.findVideo(id);
        if (video.length === 1){
            videos.splice(video[0].id,1);
            return video;
        }
        return []

    },
}