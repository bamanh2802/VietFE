'use client';

import React, { useEffect } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface FileViewerProps {
  fileUrl: string;
  fileType: 'pdf' | 'docx';
  isDocument: boolean
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType, isDocument }) => {
  if (fileType !== 'pdf') return null;

  useEffect(()=> {
    console.log(fileUrl, fileType)
  }, [fileUrl, fileType])

  // Plugin mặc định với các tính năng đầy đủ
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: (zoom) => {
          document.documentElement.requestFullscreen();
        },
        onExitFullScreen: (zoom) => {
          document.exitFullscreen();
        },
      },
    },
  });

  return (
    <div 
      style={{ 
        height: `${isDocument ? 'calc(100vh - 160px)' : 'calc(100vh - 336px)'}`,
        width: '100%',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          theme={{
            theme: 'auto'
          }}
          renderLoader={(percentages: number) => (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>Loading document: {Math.round(percentages)}%</div>
            </div>
          )}
          
        />
      </Worker>
    </div>
  );
};

export default FileViewer;