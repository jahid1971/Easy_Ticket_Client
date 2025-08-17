import { useState, useRef, useEffect } from "react";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";

const SearchInput = ({
    params,
    setParams,
}: {
    params: any;
    setParams: any;
}) => {
    const [searchValue, setSearchValue] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleOnChange = (e: any) => {
        const value = e.target.value;
        setSearchValue(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const updatedParams = params.filter(
                (param: any) =>
                    param.name !== "searchTerm" && param.name !== "page"
            );
            const newParams = [
                ...updatedParams,
                { name: "searchTerm", value },
                { name: "page", value: 1 },
            ];
            setParams(newParams);
        }, 500);
    };

    useEffect(() => {
        if (params.length < 1) setSearchValue("");
    }, [params]);

    return (
        <div className="relative w-64">
            <Input
                value={searchValue}
                onChange={handleOnChange}
                className="pr-9"
                placeholder="Search"
            />
            <button className="absolute border-l right-0 top-0">
                <Search className="size-5 text-muted-foreground m-2.5" />
            </button>
        </div>
    );
};

export default SearchInput;