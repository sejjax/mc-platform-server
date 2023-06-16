import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { User } from 'src/users/user.entity'
import { getRepository } from 'typeorm'

@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsPartnerIdExists implements ValidatorConstraintInterface {
  async validate(value: string) {
    const entity = await getRepository(User).findOne({ where: { partnerId: value } })

    return Boolean(entity)
  }
}


