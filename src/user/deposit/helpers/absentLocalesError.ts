import { AbsentLocale } from "./absentLocale";

export const absentLocalesError = (absentLocales: AbsentLocale[]) =>
                `Following locales are absent: ${
                    [...absentLocales.values()].map(err => `[lang: ${err.locale
                }, service_name: ${err.service_name}]`).join(', ')}`