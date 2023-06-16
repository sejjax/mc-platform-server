export const filterObjectDto = <Instance>(
  requestObject: object,
  keysToSave: (keyof Instance)[],
): Instance => {
  const newObject = { ...requestObject };

  const newObjectKeys = Object.keys(newObject);
  for (const key of newObjectKeys) {
    // @ts-ignore
    if (!keysToSave.includes(key)) delete newObject[key];
  }
  return newObject as Instance;
};
