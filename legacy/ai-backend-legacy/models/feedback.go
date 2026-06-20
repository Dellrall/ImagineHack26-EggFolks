package models

type Feedback struct {
	EmployeeID string `json:"employee_id"`
	RouteID    string `json:"route_id"`
	Rating     int    `json:"rating"`
	Comment    string `json:"comment"`
}
