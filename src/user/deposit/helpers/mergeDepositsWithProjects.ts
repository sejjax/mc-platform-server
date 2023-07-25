import { Deposit } from "../entities/deposit.entity";
import { Project } from "../../../strapi/projects/projects.entity";

// export const mergeDepositsWithProjects = (deposits: Deposit[], projects: Project[]) =>
//     deposits.map(deposit => {
//         const _product = projects.find(proj => proj.CHANGE_KEY === deposit.product_service_description)
//         return {...deposit, product: _product ?? deposit.product}
//     })