import {
  Title,
  Text,
  Table,
  Select,
  Flex,
  CheckIcon,
  ThemeIcon,
  Container,
  ScrollArea,
  Stack,
} from "@mantine/core";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAllMapped } from "../../store/import/slice";
import { useAppSelector } from "../../store/hooks";

function MappingTable() {
  const dispatch = useDispatch();
  const fileHeaders = useAppSelector((state) => state.importLeads.fileHeaders);
  const fileRows = useAppSelector((state) => state.importLeads.fileRows);

  type PropertyObject = {
    value: string;
    label: string;
    disabled: boolean;
  };

  type HeaderObject = {
    columnHeader: string;
    preview: string[];
    mapped: boolean;
    property: string;
  };

  const dummyProperties: Record<string, PropertyObject> = {
    email: { value: "email", label: "Email", disabled: false },
    first_name: { value: "first_name", label: "First_Name", disabled: false },
    last_name: { value: "last_name", label: "Last_Name", disabled: false },
    address: { value: "address", label: "Address", disabled: false },
    phone: { value: "phone", label: "Phone", disabled: false },
    city: { value: "city", label: "City", disabled: false },
    state: { value: "state", label: "State", disabled: false },
    zip: { value: "zip", label: "Zip", disabled: false },
    notes: { value: "notes", label: "Notes", disabled: false },
    status: { value: "status", label: "Status", disabled: false },
  };

  const [headers, setHeaders] = useState<HeaderObject[]>([]);
  const [properties, setProperties] = useState(dummyProperties);
  const [mappingTable, setMappingTable] = useState([]);
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
                  data={Object.values(properties)}
                  onChange={(newProperty) => handleChange(newProperty, i)}
                  searchable
                />
              ) : (
                <Select
                  placeholder={headers[i].property}
                  data={Object.values(properties)}
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
    //this if condition checks if the header is already mapped, if it is we have to make the property that it was mapped to available again
    if (headers[headerIndex].mapped) {
      const resetProperty = headers[headerIndex].property;
      setProperties((properties) => ({
        ...properties,
        [resetProperty]: { ...properties[resetProperty], disabled: false },
      }));
    }

    //we disable this property so other headers can't be mapped to it
    setProperties((properties) => ({
      ...properties,
      [newProperty]: { ...properties[newProperty], disabled: true },
    }));

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
      <Container py="sm">
        <Flex justify="center" py="xs">
          <Title order={2}>
            Map columns in your file to contact properties
          </Title>
        </Flex>
        <Flex justify="center">
          <Text c="dimmed">
            Each column header below should be mapped to a contact property{" "}
          </Text>
        </Flex>
      </Container>

      <ScrollArea h={370}>
        <Table
          highlightOnHover
          horizontalSpacing="lg"
          verticalSpacing="xs"
          withBorder
          py="md"
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
      </ScrollArea>
    </>
  );
}

export default MappingTable;
