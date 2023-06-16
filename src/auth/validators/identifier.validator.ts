import {
  isEmail,
  isMobilePhone,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'IsIdentifier',
  async: true,
})
export class IsIdentifier implements ValidatorConstraintInterface {
  async validate(value: string) {
    const trimValue = value.trim();
    return isEmail(trimValue) || isMobilePhone(trimValue);
  }

  public defaultMessage() {
    return 'incorrectIdentifier';
  }
}
