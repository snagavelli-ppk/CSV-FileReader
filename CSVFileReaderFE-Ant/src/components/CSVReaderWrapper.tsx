// CSVReaderWrapper.tsx
import React from 'react';
import CSVReader, { IFileInfo } from 'react-csv-reader';

interface CSVReaderWrapperProps {
  onFileLoaded: (data: any[], fileInfo: { name: string }) => void;
}

const CSVReaderWrapper: React.FC<CSVReaderWrapperProps> = ({ onFileLoaded }) => {
  const handleFileLoaded = (data: any[], fileInfo: IFileInfo): void => {
    onFileLoaded(data, { name: fileInfo.name });
  };

  return <CSVReader onFileLoaded={handleFileLoaded} />;
};

export default CSVReaderWrapper;
