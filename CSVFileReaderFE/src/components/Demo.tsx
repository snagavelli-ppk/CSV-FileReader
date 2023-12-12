import React, { useState, ChangeEvent } from 'react';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  MenuItem,
  InputLabel,
  Input,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { Select, SelectChangeEvent } from '@mui/material';

import CSVReader, { IFileInfo } from 'react-csv-reader';

interface Employee {
  id: string;
  name: string;
  deptname: string;
  deptno: string;
  sitename: string;
  siteno: string;
}

interface Depts {
  deptname: string;
  deptno: string;
}

interface Sites {
  sitename: string;
  siteno: string;
}

const Demo: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [csvData, setCSVData] = useState<Employee[]>([]);
  const [deptsData, setDeptsData] = useState<Depts[]>([]);
  const [sitesData, setSitesData] = useState<Sites[]>([]);
  const [emailError, setEmailError] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handleFileSelectChange = (e: SelectChangeEvent<string>) => {
    const selectedFileName = e.target.value as string;
    setSelectedFileName(selectedFileName);
    setFileError('');
  };

  const isValidEmployeesCSV = (data: any[]): boolean => {
    if (data.length === 0) {
      return false;
    }

    const headers = data[0];
    const expectedHeaders = ['id', 'name', 'deptname', 'deptno', 'sitename', 'siteno'];

    return expectedHeaders.every((header, index) => headers[index] === header);
  };

  const isValidDeptsCSV = (data: any[]): boolean => {
    if (data.length === 0) {
      return false;
    }

    const headers = data[0];
    const expectedHeaders = ['deptname', 'deptno'];

    return expectedHeaders.every((header, index) => headers[index] === header);
  };

  const isValidSitesCSV = (data: any[]): boolean => {
    if (data.length === 0) {
      return false;
    }

    const headers = data[0];
    const expectedHeaders = ['sitename', 'siteno'];

    return expectedHeaders.every((header, index) => headers[index] === header);
  };

  const handleCSVRead = (data: any[], fileInfo: IFileInfo) => {
    const formattedData = mapCSVToEmployee(data);
    setCSVData(formattedData);
    console.log('File Info:', fileInfo);

    if (selectedFileName === 'employees.csv' && !isValidEmployeesCSV(data)) {
      setFileError('Invalid CSV file for Employees.');
    } else {
      setFileError('');
    }
  };

  const handleDeptsCSVRead = (data: any[], fileInfo: IFileInfo) => {
    const formattedData = mapCSVToDepts(data);
    setDeptsData(formattedData);
    console.log('File Info:', fileInfo);

    if (selectedFileName === 'depts.csv' && !isValidDeptsCSV(data)) {
      setFileError('Invalid CSV file for Depts.');
    } else {
      setFileError('');
    }
  };

  const handleSitesCSVRead = (data: any[]) => {
    const formattedData = mapCSVToSites(data);
    setSitesData(formattedData);
    // console.log('File Info:', fileInfo);

    if (selectedFileName === 'sites.csv' && !isValidSitesCSV(data)) {
      setFileError('Invalid CSV file for Sites.');
    } else {
      setFileError('');
    }
  };

  const handleSubmit = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!selectedFileName) {
      setFileError('File is required.');
      valid = false;
    } else if (fileError) {
      valid = false;
    } else {
      setFileError('');
    }

    if (selectedFileName === 'employees.csv' && csvData.length === 0) {
      setFileError('Please select a valid Employees CSV file.');
      valid = false;
    }

    if (valid) {
      console.log('Email:', email);
      console.log('Selected File:', selectedFileName);

      switch (selectedFileName) {
        case 'employees.csv':
          console.log('Employees Data:', csvData);
          break;
        case 'depts.csv':
          console.log('Depts Data:', deptsData);
          break;
        case 'sites.csv':
          console.log('Sites Data:', sitesData);
          break;
        default:
          break;
      }

      setEmail('');
      setSelectedFileName('');
      setCSVData([]);
      setDeptsData([]);
      setSitesData([]);
    }
  };

  const mapCSVToEmployee = (data: any[]): Employee[] => {
    const headers = data[0];
    const csvDataWithoutHeaders = data.slice(1);

    return csvDataWithoutHeaders.map((row) =>
      headers.reduce((acc: any, header: any, index: any) => {
        acc[header as keyof Employee] = row[index];
        return acc;
      }, {} as Employee)
    );
  };

  const mapCSVToDepts = (data: any[]): Depts[] => {
    const headers = data[0];
    const csvDataWithoutHeaders = data.slice(1);

    return csvDataWithoutHeaders.map((row) =>
      headers.reduce((acc: any, header: any, index: any) => {
        acc[header as keyof Depts] = row[index];
        return acc;
      }, {} as Depts)
    );
  };

  const mapCSVToSites = (data: any[]): Sites[] => {
    const headers = data[0];
    const csvDataWithoutHeaders = data.slice(1);

    return csvDataWithoutHeaders.map((row) =>
      headers.reduce((acc: any, header: any, index: any) => {
        acc[header as keyof Sites] = row[index];
        return acc;
      }, {} as Sites)
    );
  };

  const getFileFormatInfo = (fileName: string): string => {
    switch (fileName) {
      case 'employees.csv':
        return 'Columns: id, name, deptname, deptno, sitename, siteno';
      case 'depts.csv':
        return 'Columns: deptname, deptno';
      case 'sites.csv':
        return 'Columns: sitename, siteno';
      default:
        return '';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          React Email and CSV App
        </Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel htmlFor="file-select">Select File</InputLabel>
          <Select
            label="Select File"
            value={selectedFileName}
            onChange={handleFileSelectChange}
            input={<Input id="file-select" />}
            error={!!fileError}
          >
            <MenuItem value="employees.csv">Employees</MenuItem>
            <MenuItem value="depts.csv">Depts</MenuItem>
            <MenuItem value="sites.csv">Sites</MenuItem>
          </Select>
          {fileError && (
            <FormHelperText error>
              {fileError}
            </FormHelperText>
          )}
        </FormControl>
        {selectedFileName && (
          <div>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {getFileFormatInfo(selectedFileName)}
            </Typography>
            <CSVReader
              onFileLoaded={(data: any[], fileInfo: IFileInfo) => {
                if (selectedFileName === 'employees.csv') {
                  handleCSVRead(data, fileInfo);
                } else if (selectedFileName === 'depts.csv') {
                  handleDeptsCSVRead(data, fileInfo);
                } else if (selectedFileName === 'sites.csv') {
                  handleSitesCSVRead(data);
                }
              }}
            />
          </div>
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Submit
        </Button>
      </Paper>
    </Container>
  );
};

export default Demo; 