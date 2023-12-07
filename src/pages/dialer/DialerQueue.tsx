// import { useEffect } from "react";
// import { PiPhoneOutgoing, PiQueue } from "react-icons/pi";
// import {
//   Card,
//   Chip,
//   Flex,
//   Group,
//   Overlay,
//   Table,
//   Text,
//   ThemeIcon,
//   Title,
// } from "@mantine/core";
// import clsx from "clsx";
// //
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { setActiveLead, setRequestAction } from "../../store/dialer/slice";
// import DialerQueueStyled from "./DialerQueue.styles";
// import CallButtonSimple from "../../components/call-buttons/CallButtonSimple";
// import { dialStateInstance } from "./DialState.class";
// import { Lead } from "../../types";

// function DialerQueue() {
//   const dispatch = useAppDispatch();

//   const { subscriptionActive } = useAppSelector((state) => state.user);
//   const { call, activeLead } = useAppSelector(
//     (state) => state.dialer
//   );

//   async function startCall(lead: Lead) {
//     dialStateInstance.activeLead = lead;
//     dispatch(setActiveLead(dialStateInstance.activeLead));
//     dispatch(setRequestAction("startCall"));
//   }

//   function stopCall() {
//     dispatch(setRequestAction("stopCall"));
//   }

//   const rows = dialQueue.length ? (
//     dialQueue.map((lead, index) => {
//       let active = false;
//       let activeIndex = false;

//       if (
//         dialStateInstance.activeLead !== null &&
//         dialQueue[dialStateInstance.activeLead].id === lead.id
//       ) {
//         activeIndex = true;
//       }

//       if (activeIndex && dialStateInstance.call) {
//         active = true;
//       }

//       return (
//         <tr
//           id={`dialer-queue-lead-${lead.id}`}
//           key={lead.id}
//           className={clsx({
//             ["active"]: active,
//             ["active-index"]: activeIndex,
//           })}
//         >
//           <td>{active ? <PiPhoneOutgoing fontSize="1.5em" /> : index + 1}</td>

//           <td className="call-icon hoverable">
//             <CallButtonSimple
//               active={!(dialStateInstance.call && active)}
//               onInactiveClick={stopCall}
//               onActiveClick={() => startCall(index)}
//             />
//           </td>
//         </tr>
//       );
//     })
//   ) : (
//     <tr>
//       <td></td>
//       <td>No calls queued</td>
//       <td></td>
//     </tr>
//   );

//   useEffect(() => {
//     if (call && dialQueue.length && activeLead !== null) {
//       const lead = dialQueue[activeLead];
//       const item = document.getElementById(`dialer-queue-lead-${lead.id}`);
//       if (item) {
//         item.scrollIntoView({
//           behavior: "smooth",
//         });
//       }
//     }
//   }, [activeLead, call]);

//   return (
//     <DialerQueueStyled>
//       <Card withBorder mih={300}>
//         <Flex justify="space-between" align="center" mb="md">
//           <Flex justify="space-between" align="center">
//             <ThemeIcon mr="xs">
//               <PiQueue />
//             </ThemeIcon>
//             <Title order={3}>Call queue</Title>
//           </Flex>
//         </Flex>

//         <div className="fade" />
//         <div className="scroll-area">
//           {!subscriptionActive && <Overlay color="#fff" opacity={0.85} />}

//           <Table horizontalSpacing="xs" verticalSpacing="sm">
//             <thead>
//               <tr>
//                 <th style={{ width: 50 }}>#</th>
//                 <th>Name</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>{rows}</tbody>
//           </Table>
//         </div>
//       </Card>
//     </DialerQueueStyled>
//   );
// }

// export default DialerQueue;

export const foo = "bar";
