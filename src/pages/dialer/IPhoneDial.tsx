import { BsFillMicMuteFill } from "react-icons/bs";
import { FaHandPaper } from "react-icons/fa";
import { BsFillTelephoneFill, BsFillTelephoneXFill } from "react-icons/bs";
import { TbGridDots } from "react-icons/tb";
import { styled } from "styled-components";
//
import devices from "../../styles/devices";

export const IPhoneDialStyled = styled.div`
  text-align: center;
  border: 1px solid #303030;
  border-radius: 6px;
  color: white;
  background-color: #2c2c2c;
  /* background: radial-gradient(ellipse at top, #005c2c, transparent),
    radial-gradient(ellipse at bottom, #94eaff, transparent); */

  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 340px;

  @media ${devices.tablet} {
    margin-left: 1rem;
    margin-right: 1rem;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .number-container {
    justify-content: center;
    align-items: center;

    @media ${devices.tablet} {
      display: flex;
    }

    .number {
      font-size: 0.8rem;
      padding-bottom: 0.25rem;

      @media ${devices.tablet} {
        font-size: 2rem;
        margin-right: 0.5rem;
      }
    }
  }

  .status {
    font-weight: 100;
  }

  .call-options {
    display: flex;
    flex-wrap: wrap;
    padding: 2rem 1rem;
  }

  .option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0.5rem;

    @media ${devices.tablet} {
      margin: 1rem;
    }

    &:hover {
      cursor: pointer;

      .icon {
        background-color: #ffffff10;
      }
    }

    &.active {
      .icon {
        background-color: white;
        color: red;
      }
    }

    &.disabled {
      opacity: 0.3;
    }

    .icon {
      width: 66px;
      height: 66px;
      border-radius: 66px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid white;
    }
  }

  .label {
    font-weight: 100;
    padding-top: 0.5rem;
  }

  .end-section {
    margin-bottom: 1rem;
  }
`;

type TIPhoneDialProps = {
  number?: string;
  status: string;
  isCallActive: boolean;
  onHold: boolean;
  muted: boolean;
  //
  setOnHold: (onHold: boolean) => void;
  setMuted: (muted: boolean) => void;
  start: () => void;
  end: () => void;
};

function IPhoneDial({
  number,
  isCallActive,
  status,
  muted,
  onHold,
  setOnHold,
  setMuted,
  start,
  end,
}: TIPhoneDialProps) {
  return (
    <IPhoneDialStyled>
      <div className="number-container">
        <div className="number">{number || "no contact"}</div>
      </div>
      <div className="status label">
        {status === "calling" ? "calling..." : status}
      </div>
      <div className="call-options">
        <div
          className={`option ${muted && "active"}`}
          onClick={() => setMuted(!muted)}
        >
          <div className="icon">
            <BsFillMicMuteFill fontSize="20px" />
          </div>
          <div className="label">mute</div>
        </div>
        <div
          className={`option ${onHold && "active"}`}
          onClick={() => setOnHold(!onHold)}
        >
          <div className="icon">
            <FaHandPaper fontSize="20px" />
          </div>
          <div className="label">hold</div>
        </div>
        <div className="option">
          <div className="icon">
            <TbGridDots fontSize="20px" />
          </div>
          <div className="label">options</div>
        </div>
      </div>

      <div className="end-section">
        {!isCallActive ? (
          <div className="option" onClick={start}>
            <div className="icon">
              <BsFillTelephoneFill fontSize="30px" color="green" />
            </div>
            <div className="label">call</div>
          </div>
        ) : (
          <div className="option" onClick={end}>
            <div className="icon">
              <BsFillTelephoneXFill fontSize="30px" color="red" />
            </div>
            <div className="label">end</div>
          </div>
        )}
      </div>
    </IPhoneDialStyled>
  );
}

export default IPhoneDial;
