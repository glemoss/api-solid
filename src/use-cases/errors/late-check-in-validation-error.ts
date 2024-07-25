export class LateCheckInValidationError extends Error {
  constructor() {
    super('Check-in can only be validated after 20 minutes of its creation.')
  }
}
