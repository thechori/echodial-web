import { useState } from "react";
import { BsFillMicMuteFill } from "react-icons/bs";
import { FaHandPaper } from "react-icons/fa";
import { BsFillTelephoneFill, BsFillTelephoneXFill } from "react-icons/bs";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
//
import DialerStyled, { DialStyled } from "./Dialer.styles";

/**

- [ ] Ability to trigger 3 concurrent calls
- [ ] Ability to listen to first call made
- [ ] Ability to be notified of someone picking up on another line (and is now currently on hold)
- [ ] Ability for person on hold to be greeted with a prerecorded message
- [ ] Ability to switch between calls

 */
function Dialer() {
  return (
    <DialerStyled>
      <div className="container">
        <h1>Dialer</h1>
        <div className="dialer-container">
          <Dial number="(832) 111-2222" />
          <Dial number="(281) 222-3333" />
          <Dial number="(346) 333-4444" />
        </div>
      </div>
    </DialerStyled>
  );
}

export default Dialer;

function Dial({ number }: { number: string }) {
  const [status, setStatus] = useState<"idle" | "calling" | "active" | "ended">(
    "idle"
  );
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);

  return (
    <DialStyled>
      <div className="number-container">
        <div className="number">{number}</div>
        <IoIosArrowDropdownCircle />
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
        {status === "idle" || status === "ended" ? (
          <div className="option" onClick={() => setStatus("calling")}>
            <div className="icon">
              <BsFillTelephoneFill fontSize="30px" color="green" />
            </div>
            <div className="label">call</div>
          </div>
        ) : (
          <div className="option" onClick={() => setStatus("ended")}>
            <div className="icon">
              <BsFillTelephoneXFill fontSize="30px" color="red" />
            </div>
            <div className="label">end</div>
          </div>
        )}
      </div>
    </DialStyled>
  );
}
