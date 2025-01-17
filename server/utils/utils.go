package utils

import (
	"errors"
	"fmt"
)

func ValidateInput(from string, to string, amount float64) error {
	if from == "" || to == "" || amount <= 0 {
		return errors.New("invalid input")
	}
	return nil
}

func FormatRates(rates map[string]float64) string {
	var result string
	for currency, rate := range rates {
        result += fmt.Sprintf("%s: %.4f ", currency, rate)
    }
	return result
}