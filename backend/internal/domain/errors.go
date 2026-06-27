package domain

import (
	"errors"
	"net/http"
)

// AppError represents a structured, transport-agnostic application error.
// It carries both a machine-readable code and a human-readable message.
type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	StatusCode int    `json:"-"`
	Err        error  `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Err.Error()
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// Sentinel error constructors - use these throughout the application.

func ErrNotFound(resource string) *AppError {
	return &AppError{
		Code:       "NOT_FOUND",
		Message:    resource + " not found",
		StatusCode: http.StatusNotFound,
	}
}

func ErrConflict(resource string) *AppError {
	return &AppError{
		Code:       "CONFLICT",
		Message:    resource + " already exists",
		StatusCode: http.StatusConflict,
	}
}

func ErrUnauthorized(reason string) *AppError {
	return &AppError{
		Code:       "UNAUTHORIZED",
		Message:    reason,
		StatusCode: http.StatusUnauthorized,
	}
}

func ErrForbidden(reason string) *AppError {
	return &AppError{
		Code:       "FORBIDDEN",
		Message:    reason,
		StatusCode: http.StatusForbidden,
	}
}

func ErrValidation(message string) *AppError {
	return &AppError{
		Code:       "VALIDATION_ERROR",
		Message:    message,
		StatusCode: http.StatusUnprocessableEntity,
	}
}

func ErrInternal(err error) *AppError {
	return &AppError{
		Code:       "INTERNAL_SERVER_ERROR",
		Message:    "an unexpected error occurred",
		StatusCode: http.StatusInternalServerError,
		Err:        err,
	}
}

// IsNotFound reports whether the error chain contains a NOT_FOUND AppError.
func IsNotFound(err error) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Code == "NOT_FOUND"
	}
	return false
}

// IsConflict reports whether the error chain contains a CONFLICT AppError.
func IsConflict(err error) bool {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Code == "CONFLICT"
	}
	return false
}
