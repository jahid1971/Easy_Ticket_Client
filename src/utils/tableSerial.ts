import { IMeta, TQuery } from "@/types/common";

export default function tableSerial(query: TQuery | undefined, index: number) {
    return ((query?.page ?? 1) - 1) * (query?.limit ?? 5) + index + 1 + ".";
}
