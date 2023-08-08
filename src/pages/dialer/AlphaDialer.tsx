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
import { styled } from "styled-components";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import phoneFormatter from "../../utils/phone-formatter";
import devices from "../../styles/devices";
import {
  selectActivePhoneNumber,
  selectActiveFullName,
  setActiveContactIndex,
  selectShowAlphaDialer,
  setShowAlphaDialer,
} from "../../store/dialer/slice";
import routes from "../../configs/routes";

const AlphaDialerStyled = styled.div`
  background-color: black;
  color: white;
  border-top: 1px solid grey;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  width: 100vw;
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;

  .details {
    display: block;
    align-items: center;

    @media ${devices.tablet} {
      display: flex;
    }

    .user-icon {
      display: none;

      @media ${devices.tablet} {
        display: block;
        font-size: 2rem;
      }
    }

    .import-contact-button {
      font-size: 1.5rem;

      @media ${devices.tablet} {
        font-size: 2rem;
      }
    }

    .lead-details {
      padding: 0;

      @media ${devices.tablet} {
        padding: 0 0.75rem;
      }

      div div {
        line-height: 1rem;
      }
    }
  }

  .controls {
    .control-buttons {
      display: flex;

      padding: 0.25rem;

      svg {
        font-size: 2.5rem;
      }

      & > div {
        padding: 0 0.5rem;
      }
    }

    .call-details {
      display: flex;

      & > div {
        padding: 0rem 0.5rem;

        @media ${devices.tablet} {
          padding: 0rem 1rem;
        }
      }
    }
  }

  .options {
  }

  @media ${devices.tablet} {
  }

  @media ${devices.desktop} {
    /* width: 600px; */
  }
`;

function AlphaDialer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { call, status, muted } = useAppSelector((state) => state.dialer);

  const phoneNumber = useAppSelector(selectActivePhoneNumber);
  const fullName = useAppSelector(selectActiveFullName);
  const showAlphaDialer = useAppSelector(selectShowAlphaDialer);

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

              {call ? (
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
                    <AiFillPlayCircle fontSize="2.5rem" className="hoverable" />
                  </div>
                </Tooltip>
              )}

              <Tooltip label="Skip to next Lead">
                <div>
                  <AiFillStepForward fontSize="2.5rem" className="hoverable" />
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
        <BiHide
          fontSize="2rem"
          className="hoverable"
          onClick={() => dispatch(setShowAlphaDialer(false))}
        />
      </Box>
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
