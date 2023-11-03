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
} from "@mantine/core";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAllMapped } from "../../store/import/slice";
import { useAppSelector } from "../../store/hooks";
import {
  dummyProperties,
  addNewPropertySelectItem,
  HeaderObject,
} from "./DummyProperties";
import { useDisclosure } from "@mantine/hooks";
import DrawerContent from "./DrawerContent";

function MappingTable() {
  const dispatch = useDispatch();
  const fileHeaders = useAppSelector((state) => state.importLeads.fileHeaders);
  const fileRows = useAppSelector((state) => state.importLeads.fileRows);

  const [headers, setHeaders] = useState<HeaderObject[]>([]);
  const [properties, setProperties] = useState<SelectItem[]>(dummyProperties);
  const [mappingTable, setMappingTable] = useState([]);

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const tempHeaders: HeaderObject[] = [];
    for (let i = 0; i < fileHeaders.length; i++) {
      tempHeaders.push({
        columnHeader: fileHeaders[i],
        preview: fileRows.slice(0, 3).map((row) => row[fileHeaders[i]]),
        mapped: false,
        property: "empty",
      });
    }
    setHeaders(tempHeaders);
  }, [fileHeaders, fileRows]);

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
            {headers[i].mapped ? (
              <ThemeIcon radius="lg" color="green">
                <CheckIcon style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            ) : (
              <ThemeIcon radius="lg" color="gray">
                <CheckIcon style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            )}
          </td>
          <td>
            {/* if the header isn't mapped, the placeholder will be set to "select", otherwise we set it to the 
            property it's mapped to */}
            <Flex justify="flex-start">
              {headers[i].property === "empty" ? (
                <Select
                  placeholder="Select"
                  value="Select"
                  data={properties}
                  onChange={(newProperty) => handleChange(newProperty, i)}
                  searchable
                />
              ) : (
                <Select
                  placeholder={headers[i].property}
                  value={headers[i].property}
                  data={properties}
                  onChange={(newProperty) => handleChange(newProperty, i)}
                  searchable
                />
              )}
            </Flex>
          </td>
        </tr>
      );
    }
    setMappingTable(renderedData);
  }, [headers, properties]);

  useEffect(() => {
    if (headers.every((header) => header.mapped === true)) {
      dispatch(setAllMapped(true));
    } else {
      dispatch(setAllMapped(false));
    }
  }, [headers, dispatch]);

  //newProperty is the property we are mapping the header at headerIndex to
  function handleChange(newProperty: any, headerIndex: any) {
    if (newProperty === addNewPropertySelectItem.value) {
      console.log("hello");
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

    //map the header to this property
    setHeaders((headers) => {
      const updatedHeaders = [...headers];
      updatedHeaders[headerIndex].mapped = true;
      updatedHeaders[headerIndex].property = newProperty;
      return updatedHeaders;
    });
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        overlayProps={{ opacity: 0.5, blur: 4 }}
        transitionProps={{
          transition: "fade",
          duration: 500,
          timingFunction: "ease",
        }}
        position="right"
      >
        <DrawerContent />
      </Drawer>
      <Container fluid pb={100}>
        <Flex justify="center" py="xs">
          <Title order={2}>
            Map columns in your file to contact properties
          </Title>
        </Flex>
        <Flex justify="center" py="xs">
          <Text c="dimmed">
            Each column header below should be mapped to a contact property{" "}
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
            </tr>
          </thead>
          <tbody>{mappingTable}</tbody>
        </Table>
      </Container>
    </>
  );
}

export default MappingTable;
