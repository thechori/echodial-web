import { Anchor, Box, Flex, Image, Modal, Text, Title } from "@mantine/core";
//
import { APP_NAME } from "../../configs/names";
import logo from "../../assets/l34ds-logo-full.png";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/hooks";
import { selectJwtDecoded } from "../../store/user/slice";

const ProtectedBetaModal = () => {
  const jwtDecoded = useAppSelector(selectJwtDecoded);

  // Show modal if they explicitly have no access
  if (!jwtDecoded || jwtDecoded.approved_for_beta) {
    return null;
  }

  // Clear JWT within local storage after showing message to allow for a new token
  // to be retrieved to avoid seeing modal again
  if (jwtDecoded && !jwtDecoded.approved_for_beta) {
    console.info("Clearing local storage...");
    localStorage.clear();
  }

  return (
    <Modal
      opened
      onClose={() =>
        console.info("Please contact us to request access to the beta")
      }
      withCloseButton={false}
      centered
    >
      <Box p="md" ta="center">
        <Title order={3}>Unauthorized</Title>
        <Box py="md">
          <Text>{APP_NAME} is still in active development.</Text>
          <Text>
            If you'd like free VIP access to our beta, contact{" "}
            <Anchor href="mailto:ryan@l34ds.net">ryan@l34ds.net</Anchor> to set
            up your account.
          </Text>
        </Box>

        <Box ta="center">
          <Text>Thank you!</Text>
          <Flex
            mt="md"
            style={{ borderRadius: 4 }}
            bg={colors.appBlue}
            py={12}
            w="200px"
            mx="auto"
            justify="center"
            align="center"
          >
            <Image width="160px" src={logo} alt={`${APP_NAME} logo`} />
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProtectedBetaModal;
