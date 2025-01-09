import React, { useState, useEffect } from "react";
import { Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import { createNewNote } from "@/service/noteApi";
import { v4 as uuidv4 } from 'uuid'
import { ToastAction } from "@/components/ui/toast"

import {
  summarizeDocument,
  shallowOutlineDocument,
} from "@/service/documentApi";
import { Button } from "@/components/ui/button";
import MindmapTree from "@/components/global/Mindmap";

interface MindmapNode {
  name: string;
  children: MindmapNode[];
}
interface AnalysisProps {
  documentName: string
}

const Analysis: React.FC<AnalysisProps> = ({documentName}) => {
  const [summarizeOutput, setSummarizeOutput] = useState<string>("");
  const [outlineOutput, setOutlineOutput] = useState<string>("");
  const [mindmap, setMindmap] = useState<MindmapNode | null>(null)
  const [savedSummarizeOutputs, setSavedSummarizeOutputs] = useState<string[]>(
    [],
  );
  const [savedOutlineOutputs, setSavedOutlineOutputs] = useState<string[]>([]);
  const [isLoadingSummarize, setIsLoadingSummarize] = useState<boolean>(false);
  const [isLoadingCreateOutlines, setIsLoadingCreateOutlines] =
    useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const { project_id, document_id } = router.query as { project_id: string, document_id?: string };

  useEffect(() => {
    // Load saved data from localStorage when component mounts
    const savedSummarize = localStorage.getItem("savedSummarizeOutputs");
    const savedOutline = localStorage.getItem("savedOutlineOutputs");

    if (savedSummarize) setSavedSummarizeOutputs(JSON.parse(savedSummarize));
    if (savedOutline) setSavedOutlineOutputs(JSON.parse(savedOutline));
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem(
      "savedSummarizeOutputs",
      JSON.stringify(savedSummarizeOutputs),
    );
    localStorage.setItem(
      "savedOutlineOutputs",
      JSON.stringify(savedOutlineOutputs),
    );
  }, [savedSummarizeOutputs, savedOutlineOutputs]);

  const handleSummarize = async () => {
    setIsLoadingSummarize(true);
    try {
      const data = await summarizeDocument(document_id as string);

      setSummarizeOutput(data.data);
    } catch (e) {
      console.log(e);
    }
    setIsLoadingSummarize(false);
  };

  const parseMindmap = (mindmapString: string): MindmapNode | null => {
    const lines = mindmapString
      .trim()
      .split("\n")
      .map((line) => line.trim());
  
    const stack: MindmapNode[] = [];
    let root: MindmapNode | null = null;
  
    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        // Root level
        const node: MindmapNode = { name: line.slice(2), children: [] };
        root = node;
        stack.splice(0, stack.length, node); // Reset stack and push root
      } else if (line.startsWith("## ")) {
        // Level 1
        const node: MindmapNode = { name: line.slice(3), children: [] };
        if (stack.length > 0) {
          stack[0].children.push(node);
        }
        stack.splice(1, stack.length - 1, node); // Keep the top 2 levels
      } else if (line.startsWith("* ")) {
        // Level 2
        const node: MindmapNode = { name: line.slice(2), children: [] };
        if (stack.length > 1) {
          stack[1].children.push(node);
        }
        stack.splice(2, stack.length - 2, node); // Keep the top 3 levels
      } else if (line.startsWith("    * ")) {
        // Level 3
        const node: MindmapNode = { name: line.slice(6), children: [] };
        if (stack.length > 2) {
          stack[2].children.push(node);
        }
        stack.splice(3, stack.length - 3, node); // Keep the top 4 levels
      }
    });
  
    return root;
  };
  

  const handleCreateOutline = async (): Promise<void> => {
    setIsLoadingCreateOutlines(true);
    try {
      const data = await shallowOutlineDocument(document_id as string);
  
      // Loại bỏ thẻ <mindmap> và chuyển đổi dữ liệu
      const cleanedData = data.data.replace(/^<mindmap>/g, "").replace(/<\/mindmap>/g, "");
      const outlineTree = parseMindmap(cleanedData);
  
      if (outlineTree) {
        setMindmap(outlineTree); // Lưu JSON dạng cây để hiển thị
      } else {
        console.error("Failed to parse mindmap data.");
      }
      console.log(outlineTree)
    } catch (e) {
      console.error("Error fetching outline data:", e);
    } finally {
      setIsLoadingCreateOutlines(false);
    }
  };
  
  


  const createDataForNote = (content: string) => {
    const data = [
      {
        id: uuidv4(),
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [
          {
            type: "text",
            text: content,
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: uuidv4(),
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left",
        },
        content: [],
        children: [],
      },
    ];
    return JSON.stringify(data);
  }
  const handleCreateNewNote = async () => {
    
    toast({
      title: "Creating...",
      description: "Waiting for create",
    });
    try {
      const data = await createNewNote(project_id as string, documentName + 'Summarize ', summarizeOutput, [], createDataForNote(summarizeOutput as string));
      toast({
        title: "New note created successfully",
        description: "Note has been save in your project",
        action: <ToastAction 
        onClick={() => {
          window.open(`/project/${project_id}?noteIdParam=${data.data.note_id}`, '_blank');
        }}
        altText="Go">Go</ToastAction>,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveOutline = () => {
    if (outlineOutput) {
      setSavedOutlineOutputs((prev) => [...prev, outlineOutput]);
      setOutlineOutput("");
    }
  };

  const handleGenerateAgainSummarize = () => {
    setSummarizeOutput("");
    handleSummarize();
  };

  const handleGenerateAgainOutline = () => {
    setOutlineOutput("");
    handleCreateOutline();
  };

  const handleDeleteSummarize = (index: number) => {
    setSavedSummarizeOutputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteOutline = (index: number) => {
    setSavedOutlineOutputs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-w-[70%] flex flex-col justify-start items-center overflow-auto h-[calc(100vh-114px)] space-y-4">
      <p className="text-lg">Analysis Content Goes Here</p>

      <div className="space-x-4">
        <Button
          disabled={isLoadingCreateOutlines || isLoadingSummarize}
          variant="default"
          onClick={handleSummarize}
        >
          {isLoadingSummarize && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Summarize
        </Button>
        <Button
          disabled={isLoadingCreateOutlines || isLoadingSummarize}
          variant="default"
          onClick={handleCreateOutline}
        >
          {isLoadingCreateOutlines && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Outline
        </Button>
      </div>

      {summarizeOutput && (
        <div className="mt-4 p-4 border rounded-lg space-y-2">
          <ReactMarkdown className="text-sm whitespace-pre-line">
            {summarizeOutput}
          </ReactMarkdown>
          <div className="flex space-x-4">
            <Button variant="default" onClick={handleCreateNewNote}>
              Save Summarize
            </Button>
            <Button variant="outline" onClick={handleGenerateAgainSummarize}>
              Generate Again
            </Button>
          </div>
        </div>
      )}

      {outlineOutput && (
        <div className="flex w-full flex-col mt-4 p-4 border rounded-lg space-y-2 max-h-96 overflow-auto">
          <ReactMarkdown className="text-sm whitespace-pre-line h-[90%] overflow-auto">
            {outlineOutput}
          </ReactMarkdown>
          <div className="flex space-x-4 w-full items-center">
            <Button variant="default" onClick={handleSaveOutline}>
              Save Outline
            </Button>
            <Button variant="outline" onClick={handleGenerateAgainOutline}>
              Generate Again
            </Button>
          </div>
        </div>
      )}

      {savedSummarizeOutputs.length > 0 && (
        <div className="mt-6 w-full">
          <h2 className="text-lg font-semibold mb-2">
            Saved Summarize Outputs
          </h2>
          <div className="space-y-4">
            {savedSummarizeOutputs.map((savedOutput, index) => (
              <div
                key={index}
                className="p-4 max-h-96 overflow-auto border rounded-lg whitespace-pre-line relative"
              >
                <ReactMarkdown>{savedOutput}</ReactMarkdown>
                <Button
                  className="absolute top-2 right-2"
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteSummarize(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedOutlineOutputs.length > 0 && (
        <div className="mt-6 w-full">
          <h2 className="text-lg font-semibold mb-2">Saved Outline Outputs</h2>
          <div className="space-y-4">
            {savedOutlineOutputs.map((savedOutput, index) => (
              <div
                key={index}
                className="p-4 border max-h-96 overflow-auto rounded-lg whitespace-pre-line relative"
              >
                <ReactMarkdown>{savedOutput}</ReactMarkdown>
                <Button
                  className="absolute top-2 right-2"
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDeleteOutline(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
        {mindmap ? (
          <MindmapTree data={mindmap} />
        ) : (
          <p>No mindmap available</p>
        )}

    </div>
  );
};

export default Analysis;
