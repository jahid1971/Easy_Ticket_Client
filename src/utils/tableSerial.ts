import { TQueryParam } from "@/types/general.types";

export default function tableSerial(params: TQueryParam[] | undefined, index: number) {
    const page = params?.find(p => p.name === "page")?.value ?? 1;
    const limit = params?.find(p => p.name === "limit")?.value ?? 5;
    return ((page) - 1) * (limit) + index + 1 + ".";
}
