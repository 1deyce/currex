package utils

import "errors"

func ValidateInput(from string, to string, amount float64) error {
	if from == "" || to == "" || amount <= 0 {
		return errors.New("invalid input")
	}
	return nil
}