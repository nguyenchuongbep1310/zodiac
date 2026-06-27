package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/domain"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// ProfileService handles all birth-profile use-cases.
type ProfileService struct {
	profileRepo domrepo.ProfileRepository
	log         *zap.Logger
}

// NewProfileService constructs a ProfileService with its repository dependency.
func NewProfileService(profileRepo domrepo.ProfileRepository, log *zap.Logger) *ProfileService {
	return &ProfileService{profileRepo: profileRepo, log: log}
}

// Create persists a new BirthProfile owned by the given user.
func (s *ProfileService) Create(ctx context.Context, userID uuid.UUID, profile *domain.BirthProfile) (*domain.BirthProfile, error) {
	profile.ID = uuid.New()
	profile.UserID = userID

	saved, err := s.profileRepo.Create(ctx, profile)
	if err != nil {
		return nil, fmt.Errorf("profileService.Create: %w", err)
	}

	s.log.Info("birth profile created",
		zap.String("profile_id", saved.ID.String()),
		zap.String("user_id", userID.String()),
	)

	return saved, nil
}

// ListForUser returns all BirthProfiles belonging to userID.
func (s *ProfileService) ListForUser(ctx context.Context, userID uuid.UUID) ([]*domain.BirthProfile, error) {
	profiles, err := s.profileRepo.ListByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("profileService.ListForUser: %w", err)
	}
	return profiles, nil
}

// GetByID fetches a single BirthProfile and enforces ownership.
// Returns ErrForbidden if the profile belongs to a different user.
func (s *ProfileService) GetByID(ctx context.Context, id, requestingUserID uuid.UUID) (*domain.BirthProfile, error) {
	profile, err := s.profileRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("profileService.GetByID: %w", err)
	}

	if profile.UserID != requestingUserID {
		return nil, domain.ErrForbidden("you do not own this profile")
	}

	return profile, nil
}
