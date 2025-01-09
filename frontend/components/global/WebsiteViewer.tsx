import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebsiteViewer: React.FC<{ websiteUrl: string }> = ({ websiteUrl }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Hàm trích xuất URL gốc
  const extractOriginalUrl = (complexUrl: string) => {
    try {
      // Tìm và trích xuất URL gốc
      const match = complexUrl.match(/https?:\/\/[^?]+/);
      return match ? match[0] : websiteUrl;
    } catch (err) {
      return websiteUrl;
    }
  };

  useEffect(() => {
    const fetchWebContent = async () => {
      try {
        // Trích xuất URL gốc
        const originalUrl = extractOriginalUrl(websiteUrl);
        
        // Thử nhiều phương án proxy
        const proxyUrls = [
          `https://cors-anywhere.herokuapp.com/${originalUrl}`,
          `https://api.allorigins.win/get?url=${encodeURIComponent(originalUrl)}`,
        ];

        let success = false;
        for (const proxyUrl of proxyUrls) {
          try {
            const response = await axios.get(proxyUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });

            // Kiểm tra và set nội dung
            const content = response.data.contents || response.data;
            if (content) {
              setContent(content);
              success = true;
              break;
            }
          } catch (proxyError) {
            console.log(`Proxy ${proxyUrl} failed`);
          }
        }

        if (!success) {
          setError('Không thể tải nội dung từ URL này');
        }
      } catch (err) {
        setError('Lỗi không xác định');
        console.error(err);
      }
    };

    fetchWebContent();
  }, [websiteUrl]);

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 160px)',
      overflow: 'auto',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '10px'
    }}>
      {error && (
        <div style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {content && (
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            maxWidth: '100%',
            overflow: 'auto'
          }}
        />
      )}
    </div>
  );
};

export default WebsiteViewer;