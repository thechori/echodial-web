import {
  Title,
  Text,
  Table,
  Select,
  Flex,
  CheckIcon,
  ThemeIcon,
  Container,
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
  function setDummyHeaders() {
    const outputData = [];
    for (let i = 0; i < fileHeaders.length; i++) {
      outputData.push({
        columnHeader: fileHeaders[i],
        preview: fileRows[0][fileHeaders[i]],
        mapped: false,
        property: "empty",
      });
    }
    return outputData;
  }
  const dummyHeaders = setDummyHeaders();

  const dummyProperties: Record<string, PropertyObject> = {
    email: { value: "email", label: "Email", disabled: false },
    first_name: { value: "first_name", label: "First_Name", disabled: false },
    last_name: { value: "last_name", label: "Last_Name", disabled: false },
    address: { value: "address", label: "Address", disabled: false },
    number: { value: "number", label: "Number", disabled: false },
  };

  const [headers, setHeaders] = useState(dummyHeaders);
  const [properties, setProperties] = useState(dummyProperties);

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

  function renderTable() {
    let renderedData = [];
    for (let i = 0; i < headers.length; i++) {
      renderedData.push(
        <tr key={i}>
          <td>{headers[i].columnHeader}</td>
          <td>{headers[i].preview}</td>
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
                />
              ) : (
                <Select
                  placeholder={headers[i].property}
                  data={Object.values(properties)}
                  onChange={(newProperty) => handleChange(newProperty, i)}
                />
              )}
            </Flex>
          </td>
        </tr>
      );
    }
    return renderedData;
  }

  useEffect(() => {
    if (headers.every((header) => header.mapped === true)) {
      dispatch(setAllMapped(true));
    } else {
      dispatch(setAllMapped(false));
    }
  }, [headers]);

  const mapTableData = renderTable();

  return (
    <>
      <Container py="md">
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

      <Table
        highlightOnHover
        horizontalSpacing="lg"
        verticalSpacing="md"
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
        <tbody>{mapTableData}</tbody>
      </Table>
    </>
  );
}

export default MappingTable;
