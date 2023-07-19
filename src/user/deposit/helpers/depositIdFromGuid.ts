import { Guid } from "../deposit.types";

export const depositIdFromGuid = (guid: Guid): number => Number(guid.split('-')[1])