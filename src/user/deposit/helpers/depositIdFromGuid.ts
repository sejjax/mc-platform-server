import { Guid } from "../deposit.types";

export const depositIdFromGuid = (guid: Guid) => Number(guid.split('-')[1])