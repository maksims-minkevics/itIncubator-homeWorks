export type Video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[],
};
export type VideoError = {
    message : string,
    field : string,
};
