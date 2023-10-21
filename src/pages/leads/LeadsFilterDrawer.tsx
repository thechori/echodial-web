import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Flex,
  Stack,
  List,
  Switch,
  Text,
  TextInput,
  Title,
  ScrollArea,
  ThemeIcon,
  Card,
  Tooltip,
  Center,
} from "@mantine/core";
import { AiOutlineClose } from "react-icons/ai";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";
//
import { LeadsFilterDrawerStyled } from "./LeadsFilterDrawer.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAppliedFilters, setOptions } from "../../store/leads/slice";
import { availableFilters } from "../../store/leads/available-filters";

const LeadsFilterDrawer = ({ opened, onClose }: any) => {
  const dispatch = useAppDispatch();
  const { appliedFilters, options } = useAppSelector((state) => state.leads);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [filteredFilters, setFilteredFilters] = useState(availableFilters);

  const handleApplyFilter = (value: string) => {
    const f = availableFilters.filter((af) => af.value === value);
    if (f && f.length === 1) {
      dispatch(setAppliedFilters([...appliedFilters, f[0]]));
    } else {
      alert("Error adding filter");
    }
    handleCancel();
  };

  const handleCancel = () => {
    setKeyword("");
    setIsSearchOpen(false);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  const clearFilters = () => {
    dispatch(setAppliedFilters([]));
  };

  const clearFilterByValue = (value: string) => {
    const newAppliedFilters = appliedFilters.filter((af) => af.value !== value);
    dispatch(setAppliedFilters(newAppliedFilters));
  };

  // Filter using keyword
  // Do not show already applied filters (TODO: determine if this is good UX -- might want to be able to add multiple filters on a field like "First name")
  useEffect(() => {
    const appliedFilterLabels = appliedFilters.map((af) => af.label);
    const filtersNotYetApplied = availableFilters.filter(
      (af) => !appliedFilterLabels.includes(af.label)
    );

    if (!keyword) return setFilteredFilters(filtersNotYetApplied);

    const f = filtersNotYetApplied.filter((af) => {
      if (af.label.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
      return false;
    });
    setFilteredFilters(f);
  }, [keyword, appliedFilters]);

  return (
    <LeadsFilterDrawerStyled>
      <Drawer
        opened={opened}
        onClose={handleClose}
        position="right"
        styles={{
          body: {
            ".filter-item": {
              padding: "0.25rem 0.5rem",
              borderRadius: "0.1rem",
            },
            ".filter-item:hover": {
              backgroundColor: "rgba(248, 249, 250, 1)",
              cursor: "pointer",
            },
          },
        }}
      >
        <Flex align="center" justify="space-between">
          <Title>Filters</Title>
          <Button
            disabled={appliedFilters.length === 0}
            color="red"
            variant="outline"
            size="sm"
            leftIcon={<AiOutlineClose />}
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </Flex>

        {isSearchOpen ? (
          <Box className="filters-search" p="md">
            <TextInput
              label="Available filters"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search for filter..."
              icon={<IconSearch />}
            />
            <ScrollArea mah={500}>
              <List py="md">
                {filteredFilters.length ? (
                  filteredFilters.map((f) => (
                    <Text
                      key={f.value}
                      className="filter-item"
                      onClick={() => handleApplyFilter(f.value)}
                    >
                      {f.label}
                    </Text>
                  ))
                ) : (
                  <Center py="md">
                    <Text>No filters found</Text>
                  </Center>
                )}
              </List>
            </ScrollArea>
            <Button variant="subtle" onClick={handleCancel} fullWidth>
              Cancel
            </Button>
          </Box>
        ) : (
          <Box className="filters-applied">
            <Stack py="lg" spacing="sm">
              {appliedFilters.length ? (
                appliedFilters.map((filter) => (
                  <Card
                    key={filter.label}
                    withBorder
                    style={{ overflow: "visible" }}
                  >
                    <Flex align="center" justify="space-between">
                      <Text pr="sm">{filter.label}</Text>
                      <Tooltip label="Remove filter">
                        <ThemeIcon
                          color="red"
                          variant="outline"
                          onClick={() => clearFilterByValue(filter.value)}
                          size="sm"
                        >
                          <IconX />
                        </ThemeIcon>
                      </Tooltip>
                    </Flex>
                  </Card>
                ))
              ) : (
                <Box ta="center" py={32}>
                  <Text mb="md">No filters applied</Text>
                </Box>
              )}
            </Stack>
            <Center mb="md">
              <Button
                leftIcon={<IconPlus size={16} />}
                onClick={() => setIsSearchOpen(true)}
              >
                Add filter
              </Button>
            </Center>

            <Box my="lg">
              <Title order={3}>Recommended filters</Title>

              <Box>
                <Stack spacing="md" py="md">
                  <Switch
                    label="Hide leads with no phone number"
                    checked={options.hideNoPhoneLeads}
                    onChange={(e) =>
                      dispatch(
                        setOptions({
                          ...options,
                          hideNoPhoneLeads: e.currentTarget.checked,
                        })
                      )
                    }
                  />
                  <Switch
                    label="Hide Do Not Call (DNC) leads"
                    checked={options.hideDoNotCallLeads}
                    onChange={(e) =>
                      dispatch(
                        setOptions({
                          ...options,
                          hideDoNotCallLeads: e.currentTarget.checked,
                        })
                      )
                    }
                  />
                  <Switch
                    label="Hide sold leads"
                    checked={options.hideSoldLeads}
                    onChange={(e) =>
                      dispatch(
                        setOptions({
                          ...options,
                          hideSoldLeads: e.currentTarget.checked,
                        })
                      )
                    }
                  />
                  <Switch
                    label="Hide closed leads"
                    checked={options.hideClosedLeads}
                    onChange={(e) =>
                      dispatch(
                        setOptions({
                          ...options,
                          hideClosedLeads: e.currentTarget.checked,
                        })
                      )
                    }
                  />
                  <Switch
                    label="Hide archived leads"
                    checked={options.hideArchivedLeads}
                    onChange={(e) =>
                      dispatch(
                        setOptions({
                          ...options,
                          hideArchivedLeads: e.currentTarget.checked,
                        })
                      )
                    }
                  />
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </LeadsFilterDrawerStyled>
  );
};

export default LeadsFilterDrawer;
