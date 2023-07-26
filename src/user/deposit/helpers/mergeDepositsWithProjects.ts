import { Deposit } from "../entities/deposit.entity";
import { Product } from "../../product/product.entity";


export const mergeDepositsWithProjects = (deposits: Deposit[], projects: Product[]) =>
    deposits.map(deposit => {
        const _product = projects.find(proj => proj.slug === deposit.product_service_description)
        return {...deposit, product: _product.name ?? deposit.product}
    })