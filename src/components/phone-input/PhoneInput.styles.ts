import { styled } from "styled-components";
import colors from "../../styles/colors";

const PhoneInputStyled = styled.div<{ $error: boolean }>`
  .PhoneInputCountry {
    margin-right: 0.75rem;
  }

  .PhoneInput input {
    height: 2.25rem;
    border: 0.0625rem solid
      ${(props) => (props.$error ? colors.red : "#ced4da")};
    border-radius: 0.25rem;
    padding-left: calc(2.25rem / 3);
    padding-right: calc(2.25rem / 3);
    font-size: 0.875rem;

    &::placeholder {
      color: rgba(0, 0, 0, 0.2);
      opacity: 1; /* Firefox */
    }

    &::-ms-input-placeholder {
      /* Edge 12 -18 */
      color: rgba(0, 0, 0, 0.2);
    }
  }

  .PhoneInputCountry {
    pointer-events: none;
  }

  .PhoneInputCountrySelectArrow {
    display: none;
  }
`;

export { PhoneInputStyled };
