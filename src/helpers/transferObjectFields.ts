export const transferObjectFields = (objFrom: object, objTo: object) => {
    Object.entries(objFrom).forEach(([key, value]) => objTo[key] = value)
}