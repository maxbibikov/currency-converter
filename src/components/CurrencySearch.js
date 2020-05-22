import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import crossIcon from "../assets/cross.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.25em 0;
  width: 100%;
`;

const SearchInput = styled.input`
  font-size: 1.5em;
  padding: 0.5em 1em;
  border: none;
  box-shadow: 0 2px 4px 0 hsla(0, 0%, 0%, 0.2);
  width: 100%;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  z-index: 10;
  background-color: #ffffff;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 3em;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: none;
  margin: 0;
  padding: 0;

  & img {
    width: 20px;
    height: 20px;
    margin: 0;
  }
`;

const CurrencyList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ListBtn = styled.button`
  padding: 0.5em 1em;
  border: none;
  background: ${props => (props.selected ? "#dbdbdb" : "#ffffff")};
  width: 100%;
  border-bottom: 1px solid #f0a500;
`;

export function CurrencySearch({
  valuesArr,
  selectedString,
  setSelectedString,
  label,
}) {
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [guessValues, setGuessValues] = React.useState([]);
  const [bufferSearch, setBufferSearch] = React.useState("");
  const [inputValue, setInputValue] = React.useState(selectedString);

  React.useEffect(() => {
    setInputValue(selectedString);
  }, [selectedString]);

  const onCloseClick = () => {
    setDropdownVisible(false);
  };

  const onSearchInput = ({ target }) => {
    setBufferSearch(target.value.toUpperCase());
    setInputValue(target.value.toUpperCase());
  };

  const onSearchFocus = () => {
    setInputValue("");
    setBufferSearch("");
    setDropdownVisible(true);
  };

  const onSearchBlur = () => {
    setInputValue(selectedString);
  };

  React.useEffect(() => {
    const guessResult = valuesArr.filter(value =>
      value.AlphabeticCode.includes(bufferSearch)
    );

    setGuessValues(guessResult);
  }, [bufferSearch, valuesArr]);

  return (
    <Container>
      <label htmlFor="search_input">{label}</label>
      <SearchInput
        id="search_input"
        type="search"
        value={inputValue}
        onChange={onSearchInput}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
        placeholder="Type to search..."
      />
      {dropdownVisible && (
        <DropdownList>
          <CloseBtn onClick={onCloseClick}>
            <img src={crossIcon} alt="cross icon" />
          </CloseBtn>
          <SearchInput
            id="search_input"
            type="search"
            value={inputValue}
            onChange={onSearchInput}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            placeholder="Type to search..."
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
          />
          <CurrencyList>
            {guessValues.map(value => (
              <ListBtn
                selected={value.AlphabeticCode === selectedString}
                key={value.AlphabeticCode}
                onClick={() => {
                  setSelectedString(value.AlphabeticCode);
                  setDropdownVisible(false);
                }}
              >
                {`${value.AlphabeticCode} - ${value.Currency}`}
              </ListBtn>
            ))}
          </CurrencyList>
        </DropdownList>
      )}
    </Container>
  );
}

CurrencySearch.propTypes = {
  valuesArr: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedString: PropTypes.string,
  setSelectedString: PropTypes.func.isRequired,
  label: PropTypes.string,
};

CurrencySearch.defaultProps = {
  selectedString: "",
  label: "",
};
