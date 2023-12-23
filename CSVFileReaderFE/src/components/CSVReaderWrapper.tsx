import React from 'react';
import CSVReader, { IFileInfo } from 'react-csv-reader';

interface CSVReaderWrapperProps {
  onFileLoaded: (data: any[], fileInfo: IFileInfo) => void;
}

const CSVReaderWrapper: React.FC<CSVReaderWrapperProps> = ({ onFileLoaded }) => {
  return (
    <CSVReader
      onFileLoaded={(data, fileInfo) => onFileLoaded(data, fileInfo)}
    />
  );
};

export default CSVReaderWrapper;
