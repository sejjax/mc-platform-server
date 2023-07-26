import { Deposit } from "../entities/deposit.entity";
import { Calculation } from "../../calculations/entities/calculation.entity";
import { transferObjectFields } from "../../../helpers/transferObjectFields";
import { Product } from "../../product/product.entity";

export const mergeCalculationsWithProjects = (calculations: Calculation[], projects: Product[]) =>
    calculations.map(calc => {
        const _product = projects.find(proj => proj.service_name === calc.product.product_service_description)
        const newCalc = new Calculation()
        const newDeposit = new Deposit()
        transferObjectFields(calc, newCalc)
        transferObjectFields(calc.product, newDeposit)
        newDeposit.product = _product?.name ?? newDeposit.product
        newCalc.product = newDeposit
        return newCalc
    })