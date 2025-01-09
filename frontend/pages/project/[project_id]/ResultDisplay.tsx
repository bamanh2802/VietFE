import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResultDisplayProps {
  type: 'summary' | 'outline' | null;
  content: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ type, content }) => {
  if (!type || !content) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{type === 'summary' ? 'Summary' : 'Outline'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert">
          {type === 'outline' ? (
            <ul className="list-disc pl-5">
              {content.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{content}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
