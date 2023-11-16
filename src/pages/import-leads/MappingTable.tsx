import {
  Title,
  Text,
  Table,
  Select,
  Flex,
  CheckIcon,
  ThemeIcon,
  Container,
  Stack,
  SelectItem,
  Drawer,
  Checkbox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setAllMapped,
  setHeaderProperties,
  initializeHeaderToProperties,
  setExcludeCheckbox,
} from "../../store/import/slice";
import { useAppSelector } from "../../store/hooks";
import { addNewPropertySelectItem, HeaderObject } from "./import-data";
import DrawerContent from "./DrawerContent";
import {
  useGetLeadStandardPropertiesQuery,
  useGetLeadCustomPropertiesQuery,
  useGetLeadPropertyGroupQuery,
  useAddValidateDataCsvMutation,
} from "../../services/lead";

function MappingTable() {
  const dispatch = useDispatch();
  const fileHeaders = useAppSelector((state) => state.importLeads.fileHeaders);
  const fileRows = useAppSelector((state) => state.importLeads.fileRows);

  //Standard Properties
  const {
    data: standardProperties,
    error: standardPropertiesError,
    isLoading: standardPropertiesLoading,
  } = useGetLeadStandardPropertiesQuery();

  //Custom Properties
  const {
    data: customProperties,
    error: customPropertiesError,
    isLoading: customPropertiesLoading,
  } = useGetLeadCustomPropertiesQuery();
  //Property Groups
  const {
    data: propertyGroups,
    error: propertyGroupsError,
    isLoading: propertyGroupsLoading,
  } = useGetLeadPropertyGroupQuery();

  const [addValidateDataCsv] = useAddValidateDataCsvMutation();

  //Validating a header to property
  const [properties, setProperties] = useState<SelectItem[]>([]);
  useEffect(() => {
    const tempProperties: SelectItem[] = [];

    if (standardPropertiesError) {
      throw standardPropertiesError;
    } else if (customPropertiesError) {
      throw customPropertiesError;
    } else if (propertyGroupsError) {
      throw propertyGroupsError;
    }
    if (propertyGroups && standardProperties) {
      const groupIdToGroupName: any = {};
      propertyGroups.forEach((item) => {
        groupIdToGroupName[item.id] = item.label;
      });
      for (const standardProperty of standardProperties) {
        tempProperties.push({
          value: standardProperty.name,
          label: standardProperty.label,
          disabled: standardProperty.lead_property_type_id != 7,
          group: groupIdToGroupName[standardProperty.lead_property_group_id],
        });
      }
      if (customProperties && customProperties.length > 0) {
        for (const customProperty of customProperties) {
          tempProperties.push({
            value: customProperty.name,
            label: customProperty.label,
            disabled: false,
            group: groupIdToGroupName[customProperty.lead_property_group_id],
          });
        }
      }
    }
    tempProperties.push(addNewPropertySelectItem);
    setProperties(tempProperties);
  }, [
    standardProperties,
    customProperties,
    standardPropertiesLoading,
    customPropertiesLoading,
    propertyGroupsLoading,
  ]);

  const headers = useAppSelector(
    (state) => state.importLeads.headersToProperties
  );

  const [errorMessageArray, setErrorMessageArray] = useState<string[]>([]);

  const [mappingTable, setMappingTable] = useState([]);

  // values for opening/closing drawer
  const [opened, { open, close }] = useDisclosure(false);

  // set the state header variable to have the values from the fileHeaders global variable
  // for the preview, we grab the first 3 values
  useEffect(() => {
    const emptyStringArray = Array.from(
      { length: fileHeaders.length },
      () => ""
    );
    setErrorMessageArray(emptyStringArray);
    const tempHeaders: HeaderObject[] = [];
    for (let i = 0; i < fileHeaders.length; i++) {
      tempHeaders.push({
        columnHeader: fileHeaders[i],
        preview: fileRows.slice(0, 3).map((row) => row[fileHeaders[i]]),
        mapped: false,
        property: null,
        excludeHeader: false,
      });
    }
    dispatch(initializeHeaderToProperties(tempHeaders));
  }, [fileHeaders, fileRows]);

  // create the mapping table
  useEffect(() => {
    let renderedData: any = [];
    for (let i = 0; i < headers.length; i++) {
      renderedData.push(
        <tr key={i}>
          <td>{headers[i].columnHeader}</td>
          <td>
            <Stack spacing="xs" py="xs">
              {headers[i].preview.map((row, i) => (
                <div key={i}>{row}</div>
              ))}
            </Stack>
          </td>
          <td>
            {/* if exclude header is checked, we don't display the map checkmark and disable the select */}
            {!headers[i].excludeHeader ? (
              headers[i].mapped ? (
                <ThemeIcon radius="lg" color="green">
                  <CheckIcon style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
              ) : (
                <ThemeIcon radius="lg" color="gray">
                  <CheckIcon style={{ width: "70%", height: "70%" }} />
                </ThemeIcon>
              )
            ) : null}
          </td>
          <td>
            {/* if the header isn't mapped, the placeholder will be set to "select", otherwise we set it to the 
            property it's mapped to */}
            <Flex justify="flex-start">
              <Select
                placeholder={
                  headers[i].property === null ? "Select" : headers[i].property
                }
                value={
                  headers[i].property === null ? "Select" : headers[i].property
                }
                data={properties}
                onChange={(newProperty) => handleChange(newProperty, i)}
                searchable
                clearable
                disabled={headers[i].excludeHeader}
                error={errorMessageArray[i]}
              />
            </Flex>
          </td>
          <td>
            <Checkbox onChange={(event) => handleExcludeChange(event, i)} />
          </td>
        </tr>
      );
    }
    setMappingTable(renderedData);
  }, [headers, properties, errorMessageArray]);

  //if all the headers are either mapped or excluded, then we display the "next" button for the user
  //to proceed
  useEffect(() => {
    if (
      headers.every(
        (header) => header.mapped === true || header.excludeHeader === true
      )
    ) {
      dispatch(setAllMapped(true));
    } else {
      dispatch(setAllMapped(false));
    }
  }, [headers, dispatch]);

  //if the exclude checkbox is checked, we call handleChange to reset that property
  function handleExcludeChange(event: any, headerIndex: number) {
    const checked = event.currentTarget.checked;
    handleChange(null, headerIndex);
    const myAction = {
      checked: checked,
      headerIndex: headerIndex,
    };
    dispatch(setExcludeCheckbox(myAction));

    return;
  }
  //newProperty is the property we are mapping the header at headerIndex to
  async function handleChange(newProperty: any, headerIndex: any) {
    try {
      const columnHeader = headers[headerIndex].columnHeader;
      const columnData = fileRows.map((entry) => entry[columnHeader]);
      const result: any = await addValidateDataCsv({
        propertyToCheck: newProperty,
        columnData: JSON.stringify(columnData),
      });
      if (result.data.error) {
        throw new Error(result.data.message);
      }

      //if the newProperty is the add property option, we open the drawer
      if (newProperty === addNewPropertySelectItem.value) {
        open();
        return;
      }
      //this if condition checks if the header is already mapped, if it is we have to make the property that it was mapped to available again
      if (headers[headerIndex].mapped) {
        const resetProperty = headers[headerIndex].property;
        setProperties((prevProperties) => {
          const updatedPropertyList = prevProperties.map((property) =>
            property.value === resetProperty
              ? { ...property, disabled: false }
              : property
          );
          return updatedPropertyList;
        });
      }

      //we disable this property so other headers can't be mapped to it
      setProperties((prevProperties) => {
        const updatedPropertyList = prevProperties.map((property) =>
          property.value === newProperty
            ? { ...property, disabled: true }
            : property
        );
        return updatedPropertyList;
      });

      const myAction = {
        newProperty: newProperty,
        headerIndex: headerIndex,
      };
      dispatch(setHeaderProperties(myAction));

      //remove error message
      const updatedErrorMessageArray = errorMessageArray.map((item, index) =>
        index === headerIndex ? "" : item
      );
      setErrorMessageArray(updatedErrorMessageArray);
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message.toString();
      }
      const updatedErrorMessageArray = errorMessageArray.map((item, index) =>
        index === headerIndex ? errorMessage : item
      );
      setErrorMessageArray(updatedErrorMessageArray);
    }
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        overlayProps={{ opacity: 0.5, blur: 4 }}
        position="right"
        withCloseButton={false}
      >
        <DrawerContent close={close} />
      </Drawer>

      <Container fluid pb={125} style={{ overflowX: "scroll" }}>
        <Flex justify="center" py="xs">
          <Title order={2}>
            Map columns in your file to contact properties
          </Title>
        </Flex>
        <Flex justify="center" py="xs">
          <Text c="dimmed">
            Each column header below must be manually mapped to a contact
            property. Option to add a property can be found at the bottom of the
            dropdown menus.
          </Text>
        </Flex>
        <Table
          highlightOnHover
          horizontalSpacing="lg"
          verticalSpacing="xs"
          withBorder
        >
          <thead>
            <tr>
              <th>Column Header</th>
              <th>Preview Information</th>
              <th>Mapped</th>
              <th>Property</th>
              <th>Exclude Column</th>
            </tr>
          </thead>
          <tbody>{mappingTable}</tbody>
        </Table>
      </Container>
    </>
  );
}

export default MappingTable;
