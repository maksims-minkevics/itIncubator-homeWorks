
export const getFormattedDate = async (
    {
       days = 0,
       years = 0,
       months = 0,
       hours = 0,
       minutes = 0,
       seconds = 0,
    } = {}) => {
    const now = new Date();

    now.setFullYear(now.getFullYear() + years);
    now.setMonth(now.getMonth() + months);

    now.setDate(now.getDate() + days);
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);
    now.setSeconds(now.getSeconds() + seconds);

    return now.toISOString();
};


export const parseFormattedDate = async (dateString: string): Promise<Date> => {
    const dateFormat = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

    if (!dateFormat.test(dateString)) {
        throw new Error("Invalid date format. Expected format: ISO 8601 with milliseconds.");
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date. Unable to parse the provided date string.");
    }

    return date;
};

export const mongoDbDate = {
    getCurrentServerDate: async (): Promise<Date> =>{
        return new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    }
}