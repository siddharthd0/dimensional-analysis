import React, { useState, useEffect } from "react";
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
  HStack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
// You should import your 'units' object here
import { units } from "../units";

const MultiStepRow = ({ row, updateRow, deleteRow, stepResult }) => {
  return (
    <Tr>
         <Td>
        <Select
          onChange={(e) => updateRow("fromUnit", e.target.value)}
          value={row.fromUnit}
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
        <Input
          type="number"
          placeholder="Factor"
          value={row.factor}
          onChange={(e) => updateRow("factor", e.target.value)}
        />
      </Td>
      <Td>
        <Select
          onChange={(e) => updateRow("toUnit", e.target.value)}
          value={row.toUnit}
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
        <IconButton
          colorScheme="red"
          variant="outline"
          aria-label="Delete"
          icon={<DeleteIcon />}
          onClick={deleteRow}
        />
      </Td>
      <Td>
  {typeof stepResult === 'number'
    ? stepResult.toFixed(4)
    : stepResult}
</Td>

    </Tr>
  );
};

export const MultiStepDimensionalAnalysis = () => {
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState(1);
    const [stepResults, setStepResults] = useState([]);

  const addRow = () => {
    setRows([...rows, { fromUnit: "meters", factor: 1, toUnit: "feet" }]);
  };

  const updateRow = (index, field, value) => {
    const newRow = { ...rows[index], [field]: value };
    setRows([...rows.slice(0, index), newRow, ...rows.slice(index + 1)]);
  };

  const deleteRow = (index) => {
    setRows([...rows.slice(0, index), ...rows.slice(index + 1)]);
  };

 

  useEffect(() => {
    calculateStepResults();
  }, [rows]);

  const calculateStepResults = () => {
    let currentResult = 1;
    const newStepResults = [];
  
    for (const row of rows) {
      const fromUnitFactor = findUnitFactor(row.fromUnit);
      const toUnitFactor = findUnitFactor(row.toUnit);
      const factor = parseFloat(row.factor);
  
      if (!fromUnitFactor || !toUnitFactor || isNaN(factor)) {
        newStepResults.push("Invalid Input");
        continue;
      }
  
      const conversionFactor = (toUnitFactor / fromUnitFactor) * factor;
      currentResult *= conversionFactor;
      newStepResults.push(currentResult);
    }
  
    setStepResults(newStepResults);
    setResult(currentResult);
  };
  
  const findUnitFactor = (unit) => {
    for (const category in units) {
      if (units[category][unit] !== undefined) {
        return units[category][unit];
      }
    }
    return null;
  };
  
  return (
    <VStack spacing={8} alignItems="flex-start">
      <Box>
        <Button onClick={addRow} colorScheme="blue">
          Add Step
        </Button>
      </Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>From Unit</Th>
            <Th>Factor</Th>
            <Th>To Unit</Th>
            <Th>Delete</Th>
            <Th>Step Result</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <MultiStepRow
              key={index}
              row={row}
              updateRow={(field, value) => updateRow(index, field, value)}
              deleteRow={() => deleteRow(index)}
              stepResult={stepResults[index]}
            />
          ))}
        </Tbody>
      </Table>
      <Box>
        <Button onClick={calculateStepResults} colorScheme="blue">
          Calculate
        </Button>
      </Box>
      <Box>
        <Input type="number" value={result} readOnly />
      </Box>
      <Box>
        <Table size="sm">
          <Thead>
            <Tr>
              {rows.map((row, index) => (
                <Th key={index}>{row.fromUnit}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              {rows.map((row, index) => (
                <Td key={index}>{row.toUnit}</Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};
