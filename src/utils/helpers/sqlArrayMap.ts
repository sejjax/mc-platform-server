export const sqlArrayMap = (column: string, fields: string[]) => fields.map(field => `${column}.${field}`)