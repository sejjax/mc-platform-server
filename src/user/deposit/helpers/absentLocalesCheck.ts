import { isEmpty } from "../../../helpers/isEmpty";
import { Deposit } from "../entities/deposit.entity";
import { Product } from "../../product/product.entity";
import { Locale } from "../../../classes/locale";
import { AbsentLocale } from "./absentLocale";

export const absentLocalesCheck = (deposits: Deposit[], products: Product[], locale: Locale): AbsentLocale[] | null => {
        const absentLocales = new Map()
        deposits.forEach(deposit => {
            if(products.find((prod: Product) => prod.service_name === deposit.product_service_description) == null)
                absentLocales.set(`${locale}:${deposit.product_service_description}`, {locale: locale, service_name: deposit.product_service_description})

        })
        if(!isEmpty(absentLocales.values()))
            return [...absentLocales.values()]
        return null

}