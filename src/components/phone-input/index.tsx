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
};

const PhoneInput = ({
  value,
  onChange,
  label,
  error,
  ...rest
}: TPhoneInputProps) => {
  return (
    <PhoneInputStyled haserror={!!error}>
      <Text fw={500} size="sm" mb={2}>
        {label}
      </Text>
      <ReactPhoneNumberInput
        international={false}
        country="US"
        defaultCountry="US"
        value={value}
        onChange={onChange}
        {...rest}
      />
      <Text size="xs" color="red">
        {error}
      </Text>
    </PhoneInputStyled>
  );
};

export { PhoneInput };
