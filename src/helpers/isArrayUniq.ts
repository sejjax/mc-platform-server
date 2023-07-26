import { lengthOf } from "./lengthOf";

export const isArrayUniq = (array: any[]): boolean => lengthOf(array) === lengthOf(new Set(array))