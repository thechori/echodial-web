import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mantine/core";
import { Box, Flex, Text } from "@mantine/core";
import {
  AiFillPlayCircle,
  AiFillStepForward,
  AiOutlineAudioMuted,
  AiOutlineAudio,
} from "react-icons/ai";
import { FaRegStopCircle, FaUser } from "react-icons/fa";
import { BiHide, BiImport } from "react-icons/bi";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import phoneFormatter from "../../utils/phone-formatter";
import {
  selectActivePhoneNumber,
  selectActiveFullName,
  setActiveContactIndex,
  selectShowAlphaDialer,
  setOptions,
  continueToNextLead,
} from "../../store/dialer/slice";
import routes from "../../configs/routes";
import AlphaDialerStyled from "./AlphaDialer.styles";

function AlphaDialer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { call, isCalling, status, muted, activeContactIndex, options } =
    useAppSelector((state) => state.dialer);

  const phoneNumber = useAppSelector(selectActivePhoneNumber);
  const fullName = useAppSelector(selectActiveFullName);
  const showAlphaDialer = useAppSelector(selectShowAlphaDialer);

  function handleNextLead() {
    dispatch(continueToNextLead());
  }

  if (!showAlphaDialer) return null;

  return (
    <AlphaDialerStyled>
      <Box className="details">
        <Box>
          <FaUser className="user-icon" color="white" />
        </Box>
        <Box className="lead-details">
          <Box>
            <Text color="white">
              {phoneFormatter(phoneNumber) || "No phone active"}
            </Text>
          </Box>
          <Box>
            <Text size="sm" color="grey">
              {fullName || "No lead active"}
            </Text>
          </Box>
        </Box>
        <Box>
          <Tooltip label="Open Dialer page">
            <div>
              <BiImport
                className="import-contact-button hoverable"
                onClick={() => navigate(routes.dialer)}
              />
            </div>
          </Tooltip>
        </Box>
      </Box>

      <Box className="controls">
        <Box>
          <Flex align="center" justify="center">
            <div className="control-buttons">
              {!muted ? (
                <Tooltip label="Mute">
                  <div>
                    <AiOutlineAudio
                      fontSize="2.5rem"
                      onClick={() => call?.mute()}
                      className={`hoverable ${call ?? "disabled"}`}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip label="Unmute">
                  <div>
                    <AiOutlineAudioMuted
                      fontSize="2.5rem"
                      onClick={() => call?.mute()}
                      className="hoverable"
                      color="red"
                    />
                  </div>
                </Tooltip>
              )}

              {isCalling ? (
                <Tooltip label="End call">
                  <div>
                    <FaRegStopCircle
                      fontSize="2.5rem"
                      className="hoverable"
                      onClick={() => dispatch(setActiveContactIndex(null))}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip label="Start call">
                  <div>
                    <AiFillPlayCircle
                      fontSize="2.5rem"
                      className="hoverable"
                      onClick={() => {
                        // Start from 0 UNLESS there is a currently selected index
                        const index =
                          activeContactIndex === null ? 0 : activeContactIndex;
                        dispatch(setActiveContactIndex(index));
                      }}
                    />
                  </div>
                </Tooltip>
              )}

              <Tooltip label="Skip to next Lead">
                <div>
                  <AiFillStepForward
                    fontSize="2.5rem"
                    className="hoverable"
                    onClick={handleNextLead}
                  />
                </div>
              </Tooltip>
            </div>
          </Flex>
        </Box>

        <div className="call-details">
          <Text size="sm">
            Status:{" "}
            <Text color="grey" span>
              {status}
            </Text>
          </Text>

          <Text size="sm">
            Duration:{" "}
            <Text color="grey" span>
              0:00
            </Text>
          </Text>
        </div>
      </Box>

      <Box className="options">
        <Tooltip label="Hide status bar">
          <div>
            <BiHide
              fontSize="2rem"
              className="hoverable"
              onClick={() =>
                dispatch(setOptions({ ...options, showAlphaDialer: false }))
              }
            />
          </div>
        </Tooltip>
      </Box>
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
