class BodyModule {
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number;
    createdAt: Date;
    publicationDate: Date;
    availableResolutions: string [];
    validationFailedFields: any [];
    reqBody:any;

    constructor(reqBody : any) {
        this.title = reqBody.title;
        this.author = reqBody.author;
        this.canBeDownloaded = reqBody.canBeDownloaded;
        this.minAgeRestriction = reqBody.minAgeRestriction;
        this.createdAt = reqBody.createdAt;
        this.publicationDate = reqBody.publicationDate;
        this.availableResolutions = reqBody.availableResolutions;
        this.validationFailedFields = [];
        this.reqBody = reqBody;

    }

    validate(){
        this.validateTitle();
        this.validateAuthor()

        if(this.createdAt){
            this.validateCreatedAt();
        }

        if(this.availableResolutions){
            this.validateAvailableResolutions();
        }

        if(this.canBeDownloaded){
            this.validateCanBeDownloaded();
        }

        if(this.minAgeRestriction){
            this.validateMinAgeRestriction();

        }

        if(this.publicationDate){
            this.validatePublicationDate();
        }

        return this.validationFailedFields;
    }

    updateFromBody(toUpdate: any){
        for (const [key, value] of Object.entries(this.reqBody)) {
            if (!Object.keys(toUpdate).includes(key)){
                return;
            }

            if (this.reqBody[key] !== "" && this.reqBody[key] !== toUpdate[key]){
                toUpdate[key] = value;
            }

        }
        return toUpdate;
    }

    validateTitle(){
        if(!this.title || this.title === ""){
            this.validationFailedFields.push({message : 'failed', field : 'title'})
            return;
        }

        if(typeof (this.title) !== "string"){
            this.validationFailedFields.push({message : 'failed', field : 'title'})
            return;
        }

        if(this.title.length > 40){
            this.validationFailedFields.push({message : 'failed', field : 'title'})
            return;
        }
    }

    validateAuthor(){
        if(!this.author || this.author === ""){
            this.validationFailedFields.push({message : 'failed', field : 'author'})
            return;
        }

        if(typeof (this.author) !== "string"){
            this.validationFailedFields.push({message : 'failed', field : 'author'})
            return;
        }

        if(this.author.length > 20){
            this.validationFailedFields.push({message : 'failed', field : 'author'})
            return;
        }
    }

    validateCanBeDownloaded(){

        if(typeof (this.canBeDownloaded) !== "boolean"){
            this.validationFailedFields.push({message : 'failed', field : 'canBeDownloaded'})
            return;
        }

    }

    validateCreatedAt(){
    }

    getNewVideoRecord(videos : any){
        const creationDate = new Date();

        const publicationDate = new Date(new Date().setDate(creationDate.getDate() + 1));
        return {
            id : +videos.length,
            title : this.title,
            author : this.author,
            canBeDownloaded : this.canBeDownloaded || false,
            minAgeRestriction : this.minAgeRestriction || null,
            createdAt : creationDate.toISOString(),
            publicationDate : this.publicationDate || publicationDate.toISOString(),
            availableResolutions : this.availableResolutions || [],
        }
    }

    validatePublicationDate(){
        if(typeof (this.publicationDate) !== "string"){
            this.validationFailedFields.push({message : 'failed', field : 'publicationDate'})
            return;
        }
    }

    validateAvailableResolutions(){
        const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

        if(this.availableResolutions.length === 0){
            this.validationFailedFields.push({message : 'failed', field : 'availableResolutions'})
            return;
        }

        for (let i = 0; i < this.availableResolutions.length; i++){
            let isResolutionAvailable = availableResolutions.includes(this.availableResolutions[i])
            if (!isResolutionAvailable){
                this.validationFailedFields.push({message : 'failed', field : 'availableResolutions'});
                return;
            }
        }

    }

    validateMinAgeRestriction(){

        if(typeof (this.minAgeRestriction) !== "number" && typeof (this.minAgeRestriction) !== "object"){
            this.validationFailedFields.push()
            return;
        }

        if(this.minAgeRestriction && this.minAgeRestriction > 18){
            this.validationFailedFields.push({message : 'failed', field : 'minAgeRestriction'})
            return;
        }

        if(this.minAgeRestriction && this.minAgeRestriction < 1){
            this.validationFailedFields.push({message : 'failed', field : 'minAgeRestriction'})
            return;
        }

    }

}


export {BodyModule};