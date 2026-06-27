// Package dto defines the Data Transfer Objects used as HTTP request/response
// bodies. Each struct is annotated with binding tags (Gin/validator) and
// OpenAPI swaggo annotations.
package dto

// RegisterRequest is the body accepted by POST /api/v1/auth/register.
//
//	@Description	New user registration payload
type RegisterRequest struct {
	// Email must be a valid RFC 5322 address.
	Email string `json:"email" binding:"required,email,max=254"`
	// Password must be at least 12 characters long.
	Password string `json:"password" binding:"required,min=12,max=128"`
}

// LoginRequest is the body accepted by POST /api/v1/auth/login.
//
//	@Description	User login credentials
type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// RefreshRequest is the body accepted by POST /api/v1/auth/refresh.
//
//	@Description	Token refresh payload
type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// TokenPair is the response body for successful auth operations.
//
//	@Description	JWT access and refresh token pair
type TokenPair struct {
	// AccessToken is a short-lived JWT (default 15 min).
	AccessToken string `json:"access_token"`
	// RefreshToken is a long-lived opaque token (default 7 days).
	RefreshToken string `json:"refresh_token"`
	// ExpiresIn is the number of seconds until the access token expires.
	ExpiresIn int64 `json:"expires_in"`
	// TokenType is always "Bearer".
	TokenType string `json:"token_type"`
}

// UserResponse is the sanitised user representation returned to the client.
//
//	@Description	Authenticated user information
type UserResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

// ForgotPasswordRequest is the body for the password reset initiation.
//
//	@Description	Payload to request a password reset email
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest is the body for completing the password reset.
//
//	@Description	Payload to set a new password using a reset token
type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=12,max=128"`
}
