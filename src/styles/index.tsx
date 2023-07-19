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

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  button {
    border-radius: 4px;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 300;
    border: none;
    background-color: ${colors.blue};
    color: white;
    transition: background-color 200ms ease;

    &:hover {
      cursor: pointer;
      background-color: ${darken(0.1, colors.blue)};
    }

    &.full {
      width: -webkit-fill-available;
    }

    &.lg {
      font-size: 1.1rem;
      padding: 1.1rem 1.5rem;
    }

    &.pink {
      background-color: ${colors.pink};
    }

    &.shadow {
      box-shadow: 0 5px 30px hsla(214, 3%, 59%, 0.996);
    }
  }

  input {
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

  .surface {
    background-color: ${colors.surface};
  }

  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .container {
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: auto;
    margin-left: auto;

    @media ${devices.tablet} {
      max-width: 1024px;
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

  hr {
    opacity: 0.3;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .hoverable {
    transition: opacity 200ms ease;

    &:hover {
      opacity: 0.6;
      cursor: pointer;
    }
  }
`;

export default StyleProvider;
