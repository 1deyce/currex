package converter

import (
	"errors"

	"github.com/1deyce/currex/rates"
)

func Convert(from string, to string, amount float64, rates rates.ExchangeRates) (float64, error) {
	fromRate, okFrom := rates.Rates[from]
	toRate, okTo := rates.Rates[to]

	if !okFrom || !okTo {
		return 0, errors.New("invalid exchange rate")
	}

	converted := amount * (toRate / fromRate)
	return converted, nil
}