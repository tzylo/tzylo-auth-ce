import { ApiError } from "./api.errors"

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super(
      "Invalid email or password",
      401,
      "INVALID_CREDENTIALS"
    )
  }
}

export class AccountAlreadyExistsError extends ApiError {
  constructor() {
    super(
      "An account with this email already exists",
      409,
      "ACCOUNT_ALREADY_EXISTS"
    )
  }
}

export class InvalidOtpError extends ApiError {
  constructor() {
    super(
      "Invalid or expired OTP",
      400,
      "INVALID_OTP"
    )
  }
}

export class EmailAlreadyVerifiedError extends ApiError {
  constructor() {
    super(
      "Email is already verified",
      409,
      "EMAIL_ALREADY_VERIFIED"
    )
  }
}

