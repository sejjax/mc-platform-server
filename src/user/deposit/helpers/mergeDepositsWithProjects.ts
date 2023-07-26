import { Deposit } from "../entities/deposit.entity";
import { Product } from "../../product/product.entity";
import { clean } from "../../../utils/helpers/clean";


export const mergeDepositsWithProjects = (deposits: Deposit[], projects: Product[]) =>
    deposits.map(deposit => {
        const _product = projects.find(proj => proj.service_name === deposit.product_service_description)
        return {
                ...deposit,
                product: _product?.name ?? deposit.product,
                payment_period: _product?.payment_period ?? deposit.payment_period,
                investment_period: _product?.invest_period ?? deposit.investment_period,
            }
    })