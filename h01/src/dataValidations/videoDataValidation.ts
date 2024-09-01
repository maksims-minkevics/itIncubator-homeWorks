import {Video, VideoError} from "../ObjectTypes";
class VideoDataValidation {
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number;
    createdAt: string;
    publicationDate: string;
    availableResolutions: string [];
    failedValidations: VideoError[];
    reqBody:Video;

    constructor(reqBody : Video) {
        this.title = reqBody.title;
        this.author = reqBody.author;
        this.canBeDownloaded = reqBody.canBeDownloaded;
        this.minAgeRestriction = reqBody.minAgeRestriction;
        this.createdAt = reqBody.createdAt;
        this.publicationDate = reqBody.publicationDate;
        this.availableResolutions = reqBody.availableResolutions;
        this.failedValidations = [];
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

        return this.failedValidations;
    }

    validateTitle(){
        if(!this.title || this.title === ""){
            this.failedValidations.push({message : 'failed', field : 'title'})
            return;
        }

        if(typeof (this.title) !== "string"){
            this.failedValidations.push({message : 'failed', field : 'title'})
            return;
        }

        if(this.title.length > 40){
            this.failedValidations.push({message : 'failed', field : 'title'})
            return;
        }
    }

    validateAuthor(){
        if(!this.author || this.author === ""){
            this.failedValidations.push({message : 'failed', field : 'author'})
            return;
        }

        if(typeof (this.author) !== "string"){
            this.failedValidations.push({message : 'failed', field : 'author'})
            return;
        }

        if(this.author.length > 20){
            this.failedValidations.push({message : 'failed', field : 'author'})
            return;
        }
    }

    validateCanBeDownloaded(){
        if(typeof (this.canBeDownloaded) !== "boolean"){
            this.failedValidations.push({message : 'failed', field : 'canBeDownloaded'})
            return;
        }

    }

    validateCreatedAt(){
    }

    validatePublicationDate(){
        if(typeof (this.publicationDate) !== "string"){
            this.failedValidations.push({message : 'failed', field : 'publicationDate'})
            return;
        }
    }

    validateAvailableResolutions(){
        const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

        if(this.availableResolutions.length === 0){
            this.failedValidations.push({message : 'failed', field : 'availableResolutions'})
            return;
        }

        for (let i = 0; i < this.availableResolutions.length; i++){
            let isResolutionAvailable = availableResolutions.includes(this.availableResolutions[i])
            if (!isResolutionAvailable){
                this.failedValidations.push({message : 'failed', field : 'availableResolutions'});
                return;
            }
        }

    }

    validateMinAgeRestriction(){

        if(typeof (this.minAgeRestriction) !== "number" && typeof (this.minAgeRestriction) !== "object"){
            this.failedValidations.push()
            return;
        }

        if(this.minAgeRestriction && this.minAgeRestriction > 18){
            this.failedValidations.push({message : 'failed', field : 'minAgeRestriction'})
            return;
        }

        if(this.minAgeRestriction && this.minAgeRestriction < 1){
            this.failedValidations.push({message : 'failed', field : 'minAgeRestriction'})
            return;
        }

    }

}


export {VideoDataValidation};