
import dayjs from "dayjs";

export const dateFaormatter = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD");
}

export const timeFormatter = (time: string) => {
    return dayjs(time).format("hh:mm a");
}