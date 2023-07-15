import { styled } from "styled-components";
//
import colors from "./colors";
import devices from "./devices";

const StyleProvider = styled.div`
  color: #343434;

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;

    &:hover {
      color: #535bf2;
    }

    &.button {
      background-color: ${colors.blue};
      color: white;
      display: block;
      margin-bottom: 1rem;
      padding: 1rem;
      width: -webkit-fill-available;
      border-radius: 4px;

      &.disabled {
        opacity: 0.3;
        pointer-events: none;
      }

      &:hover {
        cursor: pointer;
        opacity: 0.6;
      }
    }
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  button {
    border-radius: 8px;
    padding: 0.6em 1.2em;
    font-size: 1em;
    border: none;

    cursor: pointer;
  }

  input {
    width: -webkit-fill-available;

    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    margin-left: auto;
    margin-right: auto;
    display: block;

    padding: 0.5rem;
    font-size: 1rem;

    @media ${devices.tablet} {
      padding: 0.75rem;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
      width: 240px;
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

  .container {
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: auto;
    margin-left: auto;

    @media ${devices.tablet} {
      max-width: 900px;
    }

    @media ${devices.desktop} {
      max-width: 1240px;
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
`;

export default StyleProvider;
