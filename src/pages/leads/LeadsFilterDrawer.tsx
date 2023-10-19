import { useState } from "react";
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
} from "@mantine/core";
import { AiOutlineClose } from "react-icons/ai";
import { IconPlus, IconSearch } from "@tabler/icons-react";
//
import LeadsAdvancedFilterDrawerStyled from "./LeadsFilterDrawer.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setOptions } from "../../store/leads/slice";
import { availableFilters } from "../../store/leads/available-filters";

const LeadsFilterDrawer = ({ opened, onClose }: any) => {
  const dispatch = useAppDispatch();
  const { appliedFilters, options } = useAppSelector((state) => state.leads);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleApplyFilter = () => {};

  const handleCancel = () => {
    setKeyword("");
    setIsSearchOpen(false);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  return (
    <LeadsAdvancedFilterDrawerStyled>
      <Drawer opened={opened} onClose={handleClose} position="right">
        <Flex align="center" justify="space-between" mb="lg">
          <Title>Filters</Title>
          <Button
            disabled={appliedFilters.length === 0}
            variant="outline"
            size="sm"
            leftIcon={<AiOutlineClose />}
          >
            Clear filters
          </Button>
        </Flex>

        {isSearchOpen ? (
          <Box className="filters-search">
            <TextInput
              label="Available filters"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search for filter..."
              onClick={handleApplyFilter}
              icon={<IconSearch />}
            />
            <List>
              {availableFilters.map((f) => (
                <Text>{f.label}</Text>
              ))}
            </List>
            <Button variant="subtle" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        ) : (
          <Box className="filters-applied">
            <Box>
              {appliedFilters.length ? (
                appliedFilters.map((filter) => (
                  <Box key={filter.label}>
                    {filter.label} - {filter.value}
                  </Box>
                ))
              ) : (
                <Box ta="center" py={64}>
                  <Text mb="md">No filters applied.</Text>
                  <Button
                    size="xs"
                    leftIcon={<IconPlus size={16} />}
                    onClick={() => setIsSearchOpen(true)}
                  >
                    Add filter
                  </Button>
                </Box>
              )}
            </Box>

            <Box>
              <Title order={3} mb="lg">
                Recommended filters
              </Title>

              <Box>
                <Stack spacing="md">
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
    </LeadsAdvancedFilterDrawerStyled>
  );
};

export default LeadsFilterDrawer;
