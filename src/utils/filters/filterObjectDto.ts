export const filterObjectDto = <Instance>(
    requestObject: object,
    keysToSave: (keyof Instance)[],
): Instance => {
    const newObject = { ...requestObject };

    const newObjectKeys = Object.keys(newObject);
    for (const key of newObjectKeys)
        if (keysToSave.find(_key => key === _key) != null) delete newObject[key];
    return newObject as Instance;
};
