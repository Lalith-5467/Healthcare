/**
 * Authentication & Registration Feature Flags Configuration
 */
export const AUTH_CONFIG = {
  /**
   * Set to `true` when email verification via OTP should be strictly enforced before completing registration.
   * Default is `false` so users can register without waiting for email verification codes.
   * To enable email verification later, set this flag to `true`.
   */
  EMAIL_VERIFICATION_ENABLED: false,
};
