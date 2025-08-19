export const modifyPayload = (values: any) => {
    const obj = { ...values };
    const file = obj["file"];
    delete obj["file"];
    const data = JSON.stringify(obj);
    const formData = new FormData();
    formData.append("data", data);
    formData.append("file", file as Blob);

    return formData;
};


export const buildPatchFromDirty = (data: any, dirty: any): any => {
    if (!dirty) return {};
    const patch: any = {};

    for (const key of Object.keys(dirty)) {
        const df = dirty[key];
        const value = data[key];

        // If the field is dirty, send the whole value (array/object/primitive)
        if (df) {
            if (value !== undefined) patch[key] = value;
        }
    }

    return patch;
};

export const onlyNestedDirtyFileds = (data: any, dirty: any): any => {
    if (!dirty) return {};
    const patch: any = {};

    for (const key of Object.keys(dirty)) {
        const df = dirty[key];
        const value = data[key];

        if (df === true) {
            if (value !== undefined) patch[key] = value;
            continue;
        }

        // for nested objects/arrays
        if (Array.isArray(value)) {
            const changedIndices = Object.keys(df)
                .filter((k) => !isNaN(Number(k)))
                .map(Number);
            if (changedIndices.length) {
                const arr = changedIndices
                    .map((i) => value[i])
                    .filter((v) => v !== undefined);
                if (arr.length) patch[key] = arr;
            }
        } else if (typeof value === "object" && value !== null) {
            const nested = buildPatchFromDirty(value, df);
            if (Object.keys(nested).length) patch[key] = nested;
        } else if (df && value !== undefined) {
            patch[key] = value;
        }
    }

    return patch;
};
