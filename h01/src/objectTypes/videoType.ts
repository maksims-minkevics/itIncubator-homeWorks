type Video = {
    title: string;
    author: string;
    canBeDownloaded: boolean;
    minAgeRestriction: number;
    createdAt: Date;
    publicationDate: Date;
    availableResolutions: string [];
    validationFailedFields: any [];
    reqBody:any;
};