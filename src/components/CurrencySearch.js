import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import crossIcon from "../assets/cross.svg";

const Container = styled.div`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  margin: 0.25em 0;
  width: 100%;
  box-shadow: 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
  height: 3em;

  @media only screen and (min-width: 900px) {
    position: relative;
  }
`;

const SearchInput = styled.input`
  border: none;
  width: 100%;
  height: 100%;
  padding: 0.5em;
`;

const SearchInputMobile = styled(SearchInput)`
  font-size: 1.5em;
  padding: 0.5em 1em;
  box-shadow: 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
  height: 2em;

  @media only screen and (min-width: 900px) {
    display: none;
  }
`;

const CurrencyPicker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow: scroll;
  z-index: 10;
  background-color: #ffffff;

  @media only screen and (min-width: 900px) {
    top: 3.5em;
    box-shadow: 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
    border: 1px solid #f0a500;
    height: auto;
    max-height: 300px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 3em;
  height: 3em;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
  transition: transform 0.2s ease;

  & img {
    width: 20px;
    height: 20px;
    margin: 0;
  }

  display: ${props => (props.visible ? "flex" : "none")};

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const CloseBtnMobile = styled(CloseBtn)`
  display: flex;
  @media only screen and (min-width: 900px) {
    display: none;
  }
`;

const CurrencyList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ListBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  border: none;
  background: ${props => (props.selected ? "#dbdbdb" : "#ffffff")};
  width: 100%;
  border-bottom: 1px solid #f0a500;

  @media only screen and (min-width: 900px) {
    &:hover {
      background-color: #dbdbdb;
      cursor: pointer;
    }
  }
`;

const FlagIcon = styled.img`
  width: 2em;
  height: 2em;
  margin: 0;
  margin-right: 1em;
`;

const InputFlagIcon = styled(FlagIcon)`
  margin: 0.5em;
  display: ${props => (props.hide ? "none" : "block")};
`;

export function CurrencySearch({
  currencyList,
  selectedCurrency,
  setSelectedCurrency,
}) {
  const [currencyPickerVisible, setCurrencyPickerVisible] = React.useState(
    false
  );
  const [guessValues, setGuessValues] = React.useState([]);
  const [bufferSearch, setBufferSearch] = React.useState("");
  const [inputValue, setInputValue] = React.useState(selectedCurrency);
  const [selectedCurrencyFlagUrl, setSelectedCurrencyFlagUrl] = React.useState(
    ""
  );
  const [selectedCurrencyEntity, setSelectedCurrencyEntity] = React.useState(
    ""
  );

  const searchInputRef = React.useRef(null);

  const onFlagIconClick = () => {
    searchInputRef.current.focus();
  };

  const setCurrencyWithName = React.useCallback(() => {
    if (selectedCurrency) {
      const selectedCurrencyData = currencyList.find(
        ({ AlphabeticCode }) => AlphabeticCode === selectedCurrency
      );
      if (selectedCurrencyData) {
        setInputValue(
          `${selectedCurrencyData.AlphabeticCode} - ${selectedCurrencyData.Currency}`
        );
        setSelectedCurrencyFlagUrl(selectedCurrencyData.flagIconUrl);
        setSelectedCurrencyEntity(selectedCurrencyData.Entity);
      }
    }
  }, [selectedCurrency, currencyList]);

  React.useEffect(() => {
    setCurrencyWithName();
  }, [setCurrencyWithName]);

  const onCloseClick = () => {
    setCurrencyPickerVisible(false);
  };

  const onSearchInput = ({ target }) => {
    setBufferSearch(target.value.toUpperCase());
    setInputValue(target.value.toUpperCase());
  };

  const onSearchFocus = () => {
    setInputValue("");
    setBufferSearch("");
    setCurrencyPickerVisible(true);
  };

  const onSearchBlur = () => {
    setCurrencyWithName();
  };

  React.useEffect(() => {
    const guessResult =
      currencyList.length > 0 &&
      currencyList.filter(
        value =>
          value.AlphabeticCode.includes(bufferSearch) ||
          value.Entity.includes(bufferSearch) ||
          // bufferSearch value is always in upper case
          // but Currency value is Capitalized so we convert it to uppercase
          value.Currency.toUpperCase().includes(bufferSearch)
      );

    setGuessValues(guessResult);
  }, [bufferSearch, currencyList]);

  return (
    <Container>
      <InputFlagIcon
        src={selectedCurrencyFlagUrl}
        alt={selectedCurrencyEntity}
        hide={currencyPickerVisible}
        onClick={onFlagIconClick}
      />
      <SearchInput
        id="search_input"
        type="search"
        value={inputValue}
        onChange={onSearchInput}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
        placeholder="Type to search..."
        autoComplete="off"
        ref={searchInputRef}
      />
      <CloseBtn onClick={onCloseClick} visible={currencyPickerVisible}>
        <img src={crossIcon} alt="cross icon" />
      </CloseBtn>
      {currencyPickerVisible && (
        <CurrencyPicker>
          <CloseBtnMobile onClick={onCloseClick}>
            <img src={crossIcon} alt="cross icon" />
          </CloseBtnMobile>
          <SearchInputMobile
            id="search_input"
            type="search"
            value={inputValue}
            onChange={onSearchInput}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            placeholder="Type to search..."
            autoComplete="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
          />
          <CurrencyList>
            {guessValues.map(value => (
              <ListBtn
                selected={value.AlphabeticCode === selectedCurrency}
                key={value.AlphabeticCode}
                onClick={() => {
                  setSelectedCurrency(value.AlphabeticCode);
                  setCurrencyPickerVisible(false);
                }}
              >
                <FlagIcon src={value.flagIconUrl} alt={value.Entity} />
                {`${value.AlphabeticCode} - ${value.Currency}`}
              </ListBtn>
            ))}
            {guessValues.length === 0 && (
              <ListBtn disabled>Sorry, nothing similar found:(</ListBtn>
            )}
          </CurrencyList>
        </CurrencyPicker>
      )}
    </Container>
  );
}

CurrencySearch.propTypes = {
  currencyList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedCurrency: PropTypes.string,
  setSelectedCurrency: PropTypes.func.isRequired,
  selectedCurrencyName: PropTypes.string,
};

CurrencySearch.defaultProps = {
  selectedCurrency: "",
  selectedCurrencyName: "",
};
