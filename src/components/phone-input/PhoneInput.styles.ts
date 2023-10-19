import { styled } from "styled-components";
import colors from "../../styles/colors";

const PhoneInputStyled = styled.div<{ haserror: boolean }>`
  .PhoneInputCountry {
    margin-right: 0.75rem;
  }

  .PhoneInput input {
    height: 2.25rem;
    border: 0.0625rem solid
      ${(props) => (props.haserror ? colors.red : "#ced4da")};
    border-radius: 0.25rem;
    padding-left: calc(2.25rem / 3);
    padding-right: calc(2.25rem / 3);
  }

  .PhoneInputCountry {
    pointer-events: none;
  }

  .PhoneInputCountrySelectArrow {
    display: none;
  }
`;

export { PhoneInputStyled };
