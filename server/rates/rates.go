package rates

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
)

type ExchangeRates struct {
	Rates map[string]float64 `json:"rates"`
}

func FetchRates(apiURL string) (ExchangeRates, error) {
	log.Printf("Fetched rates: %+v\n", apiURL)
	resp, err := http.Get(apiURL)
	if err != nil {
		return ExchangeRates{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ExchangeRates{}, errors.New("HTTP request failed with status code: " + resp.Status)
	}

	var rates ExchangeRates
	if err := json.NewDecoder(resp.Body).Decode(&rates); err != nil {
		return ExchangeRates{}, err
	}

	return rates, nil
}