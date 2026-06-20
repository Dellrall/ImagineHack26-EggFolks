package services

import (
	"sync"

	"eco-route/models"
)

type RouterService struct {
	aiClient *AIClient
	mu       sync.Mutex
	feedback []models.Feedback
}

func NewRouterService(aiClient *AIClient) *RouterService {
	return &RouterService{
		aiClient: aiClient,
		feedback: make([]models.Feedback, 0),
	}
}

func (s *RouterService) GetRecommendedRoute() (models.RouteRecommendation, error) {
	return s.aiClient.GetRouteRecommendation()
}

func (s *RouterService) StoreFeedback(feedback models.Feedback) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.feedback = append(s.feedback, feedback)

	return s.aiClient.SubmitFeedback(feedback)
}
