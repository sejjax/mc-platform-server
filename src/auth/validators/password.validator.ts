import {
  isNotEmpty,
  matches,
  minLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'IsPassword',
  async: true,
})
export class IsPassword implements ValidatorConstraintInterface {
  async validate(value: string) {
    return (
      minLength(value, 8) &&
      matches(value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/) &&
      isNotEmpty(value)
    );
  }

  public defaultMessage() {
    return 'incorrectPasswordFormat';
  }
}
