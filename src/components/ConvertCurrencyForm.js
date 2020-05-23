import React from "react";
import styled from "styled-components";
import currencyInfoArr from "../assets/currency_map";

// Components
import { CurrencySearch } from "./CurrencySearch";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;

  @media only screen and (min-width: 900px) {
    flex-direction: row;
    justify-content: space-evenly;
    width: 90%;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2em;
  width: 100%;

  @media only screen and (min-width: 900px) {
    margin: 0;
  }
`;
const VerticalGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media only screen and (min-width: 900px) {
    width: 70%;
  }
`;

const NumInput = styled.input`
  padding: 0.5em 1em;
  border: none;
  box-shadow: 0px 2px 4px 0 hsla(0, 0%, 0%, 0.2);
  font-weight: bold;
  width: 100%;
  font-size: 1.5em;
  margin: 0.25em 0;

  @media only screen and (min-width: 900px) {
    order: 1;
  }
`;

const Label = styled.label`
  font-size: 1.2em;
  margin-bottom: 0.5em;
`;

const defaultBaseCurrency = "USD";
const defaultTargetCurrency = "EUR";

export function ConvertCurrencyForm() {
  const [exchangeData, setExchangeData] = React.useState([]);
  const [baseCurrencyAmount, setBaseCurrencyAmount] = React.useState(1);
  const [targetCurrencyAmount, setTargetCurrencyAmount] = React.useState(0);
  const [baseCurrency, setCurrency1] = React.useState(defaultBaseCurrency);
  const [targetCurrency, setCurrency2] = React.useState(defaultTargetCurrency);
  const [targetFocused, setTargetFocused] = React.useState(false);

  const setBaseCurrencyAmountChange = event => {
    setBaseCurrencyAmount(event.target.value);
  };
  const setTargetCurrencyAmountChange = event => {
    setTargetCurrencyAmount(event.target.value);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
  };

  React.useEffect(() => {
    if (baseCurrency && baseCurrency.length === 3) {
      window
        .fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`)
        .then(response => {
          if (!response.ok) {
            throw Error("Currency exchange data request error!");
          }
          return response
            .json()
            .then(exchangeData => {
              const withData = Object.entries(exchangeData.rates).map(
                ([key, value]) => {
                  const currencyData = currencyInfoArr.find(
                    currency => currency.AlphabeticCode === key
                  );
                  return { exchangeRate: value, ...currencyData };
                }
              );
              setExchangeData(withData);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
    return () => {};
  }, [baseCurrency]);

  React.useEffect(() => {
    if (exchangeData.length > 0) {
      const targetCurrencyData = exchangeData.find(
        ({ AlphabeticCode }) => AlphabeticCode === targetCurrency
      );
      let targetCurrencyRate = 1;

      if (targetCurrencyData) {
        targetCurrencyRate = targetCurrencyData.exchangeRate;
      }

      if (targetFocused) {
        // convert target to base
        const targetToBase =
          Number(targetCurrencyAmount) / Number(targetCurrencyRate);
        const targetToBaseResult = Number.isInteger(targetToBase)
          ? targetToBase
          : Number(targetToBase.toFixed(2));

        setBaseCurrencyAmount(targetToBaseResult);
      } else {
        // convert base to target
        const baseToTarget =
          Number(baseCurrencyAmount) * Number(targetCurrencyRate);
        const baseToTargetResult = Number.isInteger(baseToTarget)
          ? baseToTarget
          : Number(baseToTarget.toFixed(2));

        setTargetCurrencyAmount(baseToTargetResult);
      }
    }
    return () => {};
  }, [
    targetCurrency,
    baseCurrencyAmount,
    exchangeData,
    targetCurrencyAmount,
    targetFocused,
  ]);

  if (!exchangeData.length > 0) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  return (
    <FormContainer onSubmit={handleFormSubmit}>
      <Row>
        <VerticalGroup>
          <Label htmlFor="base_currency_amount">FROM</Label>
          <NumInput
            id="base_currency_amount"
            value={baseCurrencyAmount}
            onChange={setBaseCurrencyAmountChange}
            type="number"
            min={0}
            step={0.01}
          />
          <CurrencySearch
            valuesArr={exchangeData}
            setSelectedString={setCurrency1}
            selectedString={baseCurrency}
          />
        </VerticalGroup>
      </Row>
      <Row>
        <VerticalGroup>
          <Label htmlFor="target_currency_amount">TO</Label>
          <CurrencySearch
            valuesArr={exchangeData}
            setSelectedString={setCurrency2}
            selectedString={targetCurrency}
          />
          <NumInput
            id="target_currency_amount"
            value={targetCurrencyAmount}
            onChange={setTargetCurrencyAmountChange}
            type="number"
            min={0}
            step={0.01}
            onFocus={() => setTargetFocused(true)}
            onBlur={() => setTargetFocused(false)}
          />
        </VerticalGroup>
      </Row>
    </FormContainer>
  );
}
