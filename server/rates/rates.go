package rates

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"time"
)

type ExchangeRates struct {
	Rates map[string]float64 `json:"rates"`
}

const ratesFile = "exchange_rates.json"
const updateTimeFile = "last_update_time.txt"

func loadRatesFromFile() (ExchangeRates, error) {
	data, err := os.ReadFile(ratesFile)
	if err != nil {
		if os.IsNotExist(err) {
			return ExchangeRates{Rates: make(map[string]float64)}, nil
		}
		return ExchangeRates{}, err
	}
	var rates ExchangeRates
	err = json.Unmarshal(data, &rates)
	return rates, err
}

func saveRatesToFile(rates ExchangeRates) error {
	data, err := json.Marshal(rates)
	if err != nil {
		return err
	}
	return os.WriteFile(ratesFile, data, 0644)
}

func fetchAndSaveRates(apiURL string) (ExchangeRates, error) {
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

	if err := saveRatesToFile(rates); err != nil {
		return ExchangeRates{}, err
	}

	if err := updateLastFetchTime(); err != nil {
		return ExchangeRates{}, err
	}

	return rates, nil
}

func FetchRates(apiURL string) (ExchangeRates, error) {
	if _, err := os.Stat(ratesFile); os.IsNotExist(err) {
		log.Println("Rates file not found, fetching exchange rates from API...")
		return fetchAndSaveRates(apiURL)
	}

	rates, err := loadRatesFromFile()
	if err != nil {
		return ExchangeRates{}, err 
	}

	lastUpdateTime, err := getLastUpdateTime()
	if err != nil {
		return ExchangeRates{}, err
	}

	if time.Since(lastUpdateTime) > 24*time.Hour {
		log.Println("Fetching new/latest rates from API...")
		return fetchAndSaveRates(apiURL)
	} else {
		log.Println("Using stored rates")
	}

	return rates, nil
}

func getLastUpdateTime() (time.Time, error) {
	data, err := os.ReadFile(updateTimeFile)
	if err != nil {
		return time.Time{}, err
	}

	var lastUpdateTime time.Time
	if err := json.Unmarshal(data, &lastUpdateTime); err != nil {
		return time.Time{}, err
	}
	return lastUpdateTime, nil
}

func updateLastFetchTime() error {
	currentTime := time.Now()
	data, err := json.Marshal(currentTime)
	if err!= nil {
        return err
    }
	return os.WriteFile("last_update_time.txt", data, 0644)
}