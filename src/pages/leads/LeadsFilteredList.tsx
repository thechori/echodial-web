import { useMemo, useRef, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { AgGridReact } from "ag-grid-react";
import {
  Box,
  Button,
  Card,
  Flex,
  HoverCard,
  MultiSelect,
  SelectItem,
  Text,
  TextInput,
} from "@mantine/core";
import { PiPhone, PiPhoneDisconnect } from "react-icons/pi";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
//
import { Lead } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useGetLeadsQuery } from "../../services/lead";
import LeadsFilterDrawer from "./LeadsFilterDrawer";
import { leadColDefs } from "./leadColDefs";
import { useGetLeadStatusesQuery } from "../../services/lead-status";
import { CellClickedEvent } from "ag-grid-community";
import { setSelectedLead } from "../../store/lead-detail/slice";
import {
  setAlphaDialerVisible,
  setDialQueue,
  setRequestAction,
} from "../../store/dialer/slice";
import { dialStateInstance } from "../dialer/DialState.class";
import {
  setRequestForImportLeadsModal,
  setRequestForManualCreateLeadsModal,
} from "../../store/leads/slice";

function LeadsFilteredList() {
  const { data: leadStatuses } = useGetLeadStatusesQuery();
  const { data: leads } = useGetLeadsQuery();

  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<Lead>>(null);
  const [keyword, setKeyword] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const { appliedFilters } = useAppSelector((state) => state.leads);
  const { call } = useAppSelector((state) => state.dialer);

  // Filter based on status
  // Filter based on filters (e.g., has been called)
  const selectFilteredLeads = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res) => res.data,
      // Filter by status
      (leads: any) => {
        // Handle undefined data
        if (!leads) return;

        // Init return array
        let filteredLeads = leads;

        /* Filter by status */

        // Filters are present, filter on them
        if (selectedStatuses.length) {
          filteredLeads = filteredLeads.filter((lead: Lead) => {
            // Status
            if (selectedStatuses.includes(lead.status || "")) {
              return true;
            }
          });
        }

        /* Filter by keyword */

        // Keyword is present, filter on it
        // if (keyword) {
        //   filteredLeads = filteredLeads.filter((lead: Lead) => {
        //     // @ts-ignore
        //     const allFieldsCombined = Object.keys(lead).map((k) => lead[k]);

        //     // Join all cell data
        //     if (
        //       allFieldsCombined
        //         .join(" ")
        //         .toLowerCase()
        //         .includes(keyword.toLowerCase())
        //     ) {
        //       return true;
        //     }
        //   });
        // }

        /* Filters */

        // Applied filters are present, filter on them
        if (appliedFilters.length) {
          for (const f of appliedFilters) {
            filteredLeads = filteredLeads.filter((lead: Lead) => {
              const isMatch = f.fn(lead);
              return isMatch;
            });
          }
        }

        /* Recommended filters */

        // Recommended filters are present, filter on them
        // if () {

        // }

        // Return what's left over from the filters
        return filteredLeads;
      }
    );
  }, [selectedStatuses, keyword, appliedFilters]);

  // Use the same posts query, but extract only part of its data
  const { filteredLeads } = useGetLeadsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      filteredLeads: selectFilteredLeads(result),
    }),
  });

  const onCellClicked = (event: CellClickedEvent<Lead>) => {
    const { data } = event;
    dispatch(setSelectedLead(data));
  };

  const startDialer = () => {
    // Load up leads into queue from filtered
    // Note: Extremely hacky way to get the sorted and filtered list of leads from the AG Grid table, but it works.
    // Very surprising there is no easy-to-use API to get this data
    const leadsForQueue: Lead[] = [];
    gridRef.current?.api.forEachNodeAfterFilterAndSort(({ data }) => {
      if (data) {
        leadsForQueue.push(data);
      }
    });

    dialStateInstance.dialQueueIndex = null;
    dispatch(setDialQueue(leadsForQueue));

    // Open dialer
    dispatch(setAlphaDialerVisible(true));
  };

  const stopCall = () => {
    dispatch(setRequestAction("stopCall"));
  };

  const openImportModal = () => {
    dispatch(setRequestForImportLeadsModal(true));
  };
  const openManualModal = () => {
    dispatch(setRequestForManualCreateLeadsModal(true));
  };

  const selectItems: SelectItem[] = leadStatuses
    ? leadStatuses.map((leadStatus) => ({
        value: leadStatus.value,
        label: leadStatus.label,
      }))
    : [];

  return (
    <Card
      withBorder
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <Flex align="flex-end" justify="space-between">
        <Flex align="flex-end">
          <MultiSelect
            w={200}
            label="Status"
            placeholder="Choose a status"
            data={selectItems}
            value={selectedStatuses}
            onChange={(values) => setSelectedStatuses(values)}
            clearButtonProps={{ "aria-label": "Clear selection" }}
            clearable
          />
        </Flex>

        <TextInput
          placeholder="Quickly filter by name, email, etc..."
          w="100%"
          px="md"
          label="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          variant={appliedFilters.length ? "light" : "subtle"}
          onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          leftIcon={<HiOutlineAdjustmentsHorizontal size={20} />}
        >
          Filters ({appliedFilters.length})
        </Button>

        <HoverCard width={280} shadow="md" openDelay={500}>
          <HoverCard.Target>
            {!call ? (
              <Button
                mx={4}
                leftIcon={<PiPhone size={16} />}
                onClick={startDialer}
              >
                Start dialer
              </Button>
            ) : (
              <Button
                mx={4}
                leftIcon={<PiPhoneDisconnect />}
                color="red"
                onClick={stopCall}
              >
                End call
              </Button>
            )}
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size="sm">
              Clicking "Start dialer" will transfer the filtered view of leads
              into your dialer queue and begin dialing.
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </Flex>

      {leads?.length === 0 ? (
        <Flex justify="center" align="center" w="100%" h={500}>
          <Box ta="center">
            <Text size="sm" mb="lg">
              Looks like you're new here. Add some leads to get started!
            </Text>
            <Button variant="gradient" onClick={openImportModal}>
              Upload a file
            </Button>
            <Text mt="sm">or</Text>
            <Button variant="subtle" onClick={openManualModal}>
              Create a new lead manually
            </Button>
          </Box>
        </Flex>
      ) : (
        <Box
          className="ag-theme-alpine lead-grid-container"
          h={500}
          my="md"
          style={{
            width: "100%",
          }}
        >
          <AgGridReact<Lead>
            ref={gridRef}
            rowData={filteredLeads}
            columnDefs={leadColDefs}
            animateRows={true}
            rowSelection="multiple"
            onCellClicked={onCellClicked}
            quickFilterText={keyword}
            overlayNoRowsTemplate=""
          />
        </Box>
      )}

      <LeadsFilterDrawer
        opened={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </Card>
  );
}

export default LeadsFilteredList;
