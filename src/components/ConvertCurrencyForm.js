import React from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";

// Assets
import switchIcon from "../assets/switch.svg";
import currencyInfoArr from "../assets/currency_map";

// Components
import { CurrencySearch } from "./CurrencySearch";
import { toKebabLowerCase, toFlagName } from "../utils/toKebabLowerCase";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  height: 100%;

  @media only screen and (min-width: 900px) {
    flex-direction: row;
    justify-content: space-evenly;
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

const SwitchBtnContainer = styled.div`
  display: flex;
`;

const SwitchBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  box-shadow: 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
  margin: 0;
  padding: 0;
  border-radius: 50%;
  margin-bottom: 2em;
  height: 3em;
  width: 3em;
  background-color: #dbdbdb;

  @media only screen and (min-width: 900px) {
    transform: rotate(90deg);
    box-shadow: 2px 0 4px 0 hsla(0, 0%, 0%, 0.2);
    margin: 0;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    &:hover {
      cursor: pointer;
      background-color: #dbdbdb;
      box-shadow: 4px 0 6px 0 hsla(0, 0%, 0%, 0.2);
      transform: rotate(90deg) scale(1.03);
    }
  }
`;

const SwitchIcon = styled.img`
  width: 1.5em;
  height: 1.5em;
  margin: 0;
  padding: 0;
`;

const NumInput = styled.input`
  height: 3em;
  padding: 0 0.5em;
  border: none;
  box-shadow: 0px 2px 4px 0 hsla(0, 0%, 0%, 0.2);
  font-weight: bold;
  width: 100%;
  font-size: 1.2rem;
  margin: 0.25em 0;

  @media only screen and (min-width: 900px) {
    order: 1;
  }
`;

const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5em;
`;

export function ConvertCurrencyForm() {
  const [exchangeData, setExchangeData] = React.useState([]);
  const [baseCurrencyAmount, setBaseCurrencyAmount] = React.useState(1);
  const [targetCurrencyAmount, setTargetCurrencyAmount] = React.useState("");
  const [baseCurrency, setBaseCurrency] = React.useState("USD");
  const [targetCurrency, setTargetCurrency] = React.useState("EUR");
  const [targetFocused, setTargetFocused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const allImagesQuery = graphql`
    query {
      allFile(filter: { sourceInstanceName: { eq: "flags" } }) {
        edges {
          node {
            base
            publicURL
          }
        }
      }
    }
  `;

  const {
    allFile: { edges: flagIcons },
  } = useStaticQuery(allImagesQuery);

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
      setLoading("true");
      window
        .fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}`)
        .then(response => {
          if (!response.ok) {
            throw Error("Currency exchange data request error!");
          }
          return response
            .json()
            .then(exchangeData => {
              const exchangeDataWithRates = Object.entries(
                exchangeData.rates
              ).map(([key, value]) => {
                const currencyData = currencyInfoArr.find(
                  currency => currency.AlphabeticCode === key
                );

                return { exchangeRate: value, ...currencyData };
              });

              // Because api lacking response data for EUR base itself
              // We need to add it manually
              if (baseCurrency === "EUR") {
                exchangeDataWithRates.push({
                  AlphabeticCode: "EUR",
                  Currency: "Euro",
                  Entity: "EUROPEAN UNION",
                  MinorUnit: "2",
                  NumericCode: 978.0,
                  WithdrawalDate: null,
                  exchangeRate: 1,
                });
              }

              const currencyDataWithImages = exchangeDataWithRates.map(
                ({ Entity, ...restData }) => {
                  const flagIcon = flagIcons.find(
                    ({ node: { base } }) =>
                      base === `${toKebabLowerCase(toFlagName(Entity))}.svg`
                  );

                  return {
                    Entity,
                    ...restData,
                    flagIconUrl: flagIcon ? flagIcon.node.publicURL : "",
                  };
                }
              );

              setExchangeData(currencyDataWithImages);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error))
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {};
  }, [baseCurrency, flagIcons]);

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
          : Number(targetToBase.toFixed(5));

        setBaseCurrencyAmount(targetToBaseResult);
      } else {
        // convert base to target
        const baseToTarget =
          Number(baseCurrencyAmount) * Number(targetCurrencyRate);
        const baseToTargetResult = Number.isInteger(baseToTarget)
          ? baseToTarget
          : Number(baseToTarget.toFixed(5));

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

  const onSwitchClick = () => {
    setTargetCurrency(baseCurrency);
    setBaseCurrency(targetCurrency);
  };

  if (!exchangeData.length > 0 || loading) {
    return (
      <FormContainer>
        <h1>Loading...</h1>
      </FormContainer>
    );
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
          />
          <CurrencySearch
            id="base_currency_search"
            currencyList={exchangeData}
            setSelectedCurrency={setBaseCurrency}
            selectedCurrency={baseCurrency}
          />
        </VerticalGroup>
      </Row>
      <SwitchBtnContainer>
        <SwitchBtn type="button" onClick={onSwitchClick}>
          <SwitchIcon src={switchIcon} alt="switch currencies" />
        </SwitchBtn>
      </SwitchBtnContainer>
      <Row>
        <VerticalGroup>
          <Label htmlFor="target_currency_amount">TO</Label>
          <CurrencySearch
            id="target_currency_search"
            currencyList={exchangeData}
            setSelectedCurrency={setTargetCurrency}
            selectedCurrency={targetCurrency}
          />
          <NumInput
            id="target_currency_amount"
            value={targetCurrencyAmount}
            onChange={setTargetCurrencyAmountChange}
            type="number"
            min={0}
            onFocus={() => setTargetFocused(true)}
            onBlur={() => setTargetFocused(false)}
          />
        </VerticalGroup>
      </Row>
    </FormContainer>
  );
}
