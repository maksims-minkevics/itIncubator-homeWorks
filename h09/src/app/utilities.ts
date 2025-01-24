
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

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};


export const parseFormattedDate = async (dateString: string): Promise<Date> =>{
    console.log(dateString)
    const dateFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    if (!dateFormat.test(dateString)) {
        throw new Error("Invalid date format. Expected format: yyyy-mm-dd hh:mm:ss");
    }

    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    if (
        year < 0 ||
        month < 1 || month > 12 ||
        day < 1 || day > 31 ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59
    ) {
        throw new Error("Invalid date or time values");
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
}

export const mongoDbDate = {
    getCurrentServerDate: async (): Promise<Date> =>{
        return new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    }
}