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
import {
  addNewPropertySelectItem,
  HeaderObject,
  useRenderProperties,
} from "./import-data";
import DrawerContent from "./DrawerContent";

function MappingTable() {
  const dispatch = useDispatch();
  const fileHeaders = useAppSelector((state) => state.importLeads.fileHeaders);
  const fileRows = useAppSelector((state) => state.importLeads.fileRows);

  const headers = useAppSelector(
    (state) => state.importLeads.headersToProperties
  );

  const [properties, setProperties] = useState<SelectItem[]>(
    useRenderProperties()
  );
  const [mappingTable, setMappingTable] = useState([]);

  // values for opening/closing drawer
  const [opened, { open, close }] = useDisclosure(false);

  // set the state header variable to have the values from the fileHeaders global variable
  // for the preview, we grab the first 3 values
  useEffect(() => {
    console.log(properties);
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
  }, [headers, properties]);

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
  function handleChange(newProperty: any, headerIndex: any) {
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
        <DrawerContent />
      </Drawer>

      <Container fluid pb={125}>
        <Flex justify="center" py="xs">
          <Title order={2}>
            Map columns in your file to contact properties
          </Title>
        </Flex>
        <Flex justify="center" py="xs">
          <Text c="dimmed">
            Each column header below should be mapped to a contact property
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
