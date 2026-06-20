package models

type ResponseEnvelope struct {
	Data  any     `json:"data"`
	Error *string `json:"error"`
}
