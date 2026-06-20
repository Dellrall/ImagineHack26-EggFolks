package services

import "eco-route/models"

type RequestWorker struct {
	routerService *RouterService
	pointsService *PointsService
}

func NewRequestWorker(routerService *RouterService, pointsService *PointsService) *RequestWorker {
	return &RequestWorker{
		routerService: routerService,
		pointsService: pointsService,
	}
}

func (w *RequestWorker) RouteRecommendation() (models.ResponseEnvelope, int) {
	route, err := w.routerService.GetRecommendedRoute()
	if err != nil {
		return ErrorEnvelope(err.Error()), 500
	}

	return SuccessEnvelope(route), 200
}

func (w *RequestWorker) RouteFeedback(feedback models.Feedback) (models.ResponseEnvelope, int) {
	if err := w.routerService.StoreFeedback(feedback); err != nil {
		return ErrorEnvelope(err.Error()), 500
	}

	return SuccessEnvelope(map[string]string{
		"message": "feedback received",
	}), 200
}

func (w *RequestWorker) MyPoints() (models.ResponseEnvelope, int) {
	points, err := w.pointsService.GetMyPoints()
	if err != nil {
		return ErrorEnvelope(err.Error()), 500
	}

	return SuccessEnvelope(points), 200
}

func SuccessEnvelope(data any) models.ResponseEnvelope {
	return models.ResponseEnvelope{
		Data:  data,
		Error: nil,
	}
}

func ErrorEnvelope(message string) models.ResponseEnvelope {
	return models.ResponseEnvelope{
		Data:  nil,
		Error: &message,
	}
}
