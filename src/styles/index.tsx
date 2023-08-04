import { styled } from "styled-components";
//
import colors from "./colors";
import devices from "./devices";
import { darken } from "polished";

const StyleProvider = styled.div`
  color: #343434;

  a {
    font-weight: 500;
    color: ${colors.blue};
    text-decoration: inherit;
    transition: color 200ms ease;

    &:hover {
      color: ${darken(0.1, colors.blue)};
      cursor: pointer;
    }

    &.light {
      color: white;
      transition: opacity 200ms ease;

      &:hover {
        opacity: 0.6;
        /* cursor: pointer; */
      }
    }

    &.button {
      background-color: ${colors.blue};
      color: white;
      display: block;
      margin: 0;
      padding: 1rem;
      border-radius: 4px;
      text-align: center;
      transition: background-color 200ms ease;

      &.disabled {
        opacity: 0.3;
        pointer-events: none;
      }

      &.full {
        width: -webkit-fill-available;
      }

      &:hover {
        cursor: pointer;
        background-color: ${darken(0.1, colors.blue)};
      }
    }
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .input-field {
    margin-bottom: 0.5rem;

    @media ${devices.tablet} {
      margin-bottom: 1rem;
    }

    .label {
      font-size: 0.8rem;
    }

    input {
      margin-top: 0;
      margin-bottom: 0;
      width: -webkit-fill-available;
    }

    .error {
      color: ${colors.red};
      font-size: 0.8rem;
    }
  }

  .silver {
    background: conic-gradient(
      #d7d7d7,
      #c3c3c3,
      #cccccc,
      #c6c6c6,
      #d7d7d7,
      #c3c3c3,
      #cccccc,
      #c6c6c6,
      #d7d7d7,
      #c3c3c3,
      #cccccc,
      #c6c6c6,
      #d7d7d7,
      #c3c3c3,
      #cccccc,
      #c6c6c6
    );
  }

  .titanium {
    background: conic-gradient(
      #e6e9bf,
      #d2b5aa,
      #cbaea3,
      #d4b5ab,
      #e6e9bf,
      #d2b5aa,
      #cbaea3,
      #d4b5ab,
      #e6e9bf,
      #d2b5aa,
      #cbaea3,
      #d4b5ab,
      #e6e9bf,
      #d2b5aa,
      #cbaea3,
      #d4b5ab
    );
  }

  .container {
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: auto;
    margin-left: auto;

    @media ${devices.tablet} {
      max-width: 1200px;
    }

    @media ${devices.desktop} {
      max-width: 1400px;
    }
  }

  .error {
    color: ${colors.red};
  }

  button.special {
    transition: all 200ms ease-in-out;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
      border-color: transparent;
      opacity: 0.8;
    }
  }

  .text-gradient {
    padding-right: 0.05em;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    &.teal {
      background-image: linear-gradient(243deg, #3dd875 23%, #0eb3a0 87%);
    }

    &.red {
      background-image: linear-gradient(243deg, #d63a14 23%, #a51616 87%);
    }

    &.light-red {
      background-image: linear-gradient(243deg, #d28876 23%, #ffa3a3 87%);
    }

    &.grey {
      background-image: linear-gradient(243deg, #dedede 23%, #fefefe 87%);
    }

    &.amber {
      background-image: linear-gradient(191deg, #f1dc39 25%, #c96e05 87%);
    }

    &.rainbow {
      background-image: linear-gradient(
        90deg,
        #ec6464,
        #eecc0b 33%,
        #3dd875 66%,
        #31b3ec
      );
    }
  }

  .form {
    background-color: white;
    padding: 1.25rem;
    border: 1px solid rgb(216, 221, 230);
    border-radius: 4px;
  }

  .input-field {
    text-align: left;

    label {
      display: block;
      margin-bottom: 0.25rem;
    }
  }

  .input-checkbox {
    display: flex;
    align-items: center;

    input[type="checkbox"] {
      margin: auto;
      margin-right: 0.5rem;
    }
  }

  .hoverable {
    transition: opacity 200ms ease;

    &:hover {
      opacity: 0.6;
      cursor: pointer;
    }
  }

  .disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

export default StyleProvider;
