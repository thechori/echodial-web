import ReactPhoneNumberInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
//
import { PhoneInputStyled } from "./PhoneInput.styles";
import { Text } from "@mantine/core";

type TPhoneInputProps = {
  value: string;
  onChange: any;
  label: string;
  error?: string;
  required?: boolean;
  flush?: boolean; // Displays no label above input (for Sign up page)
};

const PhoneInput = ({
  value,
  onChange,
  label,
  error,
  required,
  flush,
  ...rest
}: TPhoneInputProps) => {
  return (
    <PhoneInputStyled haserror={!!error}>
      {!flush && (
        <Text fw={500} size="sm" mb={2}>
          {label}{" "}
          {required && (
            <Text span color="red">
              *
            </Text>
          )}
        </Text>
      )}

      <ReactPhoneNumberInput
        international={false}
        country="US"
        defaultCountry="US"
        value={value}
        onChange={onChange}
        placeholder={flush ? "Phone number *" : "(123) 456-7890"}
        rules={{ required }}
        {...rest}
      />
      <Text size="xs" color="red">
        {error}
      </Text>
    </PhoneInputStyled>
  );
};

export { PhoneInput };
