import React, { useState } from "react";
import {
  Box,
  Input,
  VStack,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { units } from "../units";

const ConversionRow = ({ row, updateRow, deleteRow }) => {
  return (
    <Tr>
      <Td>
        <Input
          type="number"
          placeholder="Initial value"
          value={row.initialValue}
          onChange={(e) => updateRow("initialValue", e.target.value)}
        />
      </Td>
      <Td>
        <Select
          onChange={(e) => updateRow("initialUnit", e.target.value)}
          value={row.initialUnit}
        >
          {Object.keys(units).map((category) =>
            Object.keys(units[category]).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))
          )}
        </Select>
      </Td>
      <Td>
        <Select
          onChange={(e) => updateRow("targetUnit", e.target.value)}
          value={row.targetUnit}
        >
          {Object.keys(units).map((category) =>
            Object.keys(units[category]).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))
          )}
        </Select>
      </Td>
      <Td>{row.result}</Td>
      <Td>
        <IconButton
          aria-label="Delete"
          icon={<DeleteIcon />}
          onClick={deleteRow}
        />
      </Td>
    </Tr>
  );
};

export const DimensionalAnalysis = () => {
  const [rows, setRows] = useState([]);
  const { colorMode } = useColorMode();

  const addRow = () => {
    setRows([...rows, { initialUnit: "meters", targetUnit: "feet", initialValue: 0, result: 0 }]);
  };

  const updateRow = (index, field, value) => {
    const newRow = { ...rows[index], [field]: value };
    if (field === "initialValue" || field === "initialUnit" || field === "targetUnit") {
      const initialCategory = Object.keys(units).find((category) =>
        Object.keys(units[category]).includes(newRow.initialUnit)
      );
      const targetCategory = Object.keys(units).find((category) =>
        Object.keys(units[category]).includes(newRow.targetUnit)
      );

      if (initialCategory === targetCategory) {
        const conversionFactor =
          units[initialCategory][newRow.targetUnit] / units[initialCategory][newRow.initialUnit];
        newRow.result = newRow.initialValue * conversionFactor;
      } else {
        newRow.result = "Invalid Conversion";
      }
    }
    setRows([...rows.slice(0, index), newRow, ...rows.slice(index + 1)]);
  };

  const deleteRow = (index) => {
    setRows([...rows.slice(0, index), ...rows.slice(index + 1)]);
  };

  return (
    <VStack spacing={8} alignItems="flex-start">
      <Box>
        <Button onClick={addRow} colorScheme="blue">
          Add Conversion
        </Button>
      </Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Initial Value</Th>
            <Th>Initial Unit</Th>
            <Th>Target Unit</Th>
            <Th>Result</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <ConversionRow
              key={index}
              row={row}
              updateRow={(field, value) => updateRow(index, field, value)}
              deleteRow={() => deleteRow(index)}
            />
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};
