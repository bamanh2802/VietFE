import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Define tree structure
interface TreeNode {
  text: string;
  children: TreeNode[];
}

// Define props for the component
interface MindMapProps {
  input: string;
}

// Parse input into a tree structure
const parseInput = (input: string): TreeNode[] => {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const root: TreeNode = { text: 'Root', children: [] };
  const stack: { node: TreeNode; level: number }[] = [{ node: root, level: 0 }];

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    const listMatch = line.match(/^(\s*)([\*\-])\s+(.*)/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const node: TreeNode = { text, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      stack[stack.length - 1].node.children.push(node);
      stack.push({ node, level });
    } else if (listMatch) {
      const indent = listMatch[1].length;
      const text = listMatch[3].trim();
      const level = Math.floor(indent / 2) + 1;

      const node: TreeNode = { text, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      stack[stack.length - 1].node.children.push(node);
      stack.push({ node, level });
    }
  });

  return root.children;
};

// Create nodes and edges from the tree
const createElements = (tree: TreeNode[]): (Node | Edge)[] => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let id = 0;

  const traverse = (node: TreeNode, parentId: string | null = null, depth: number = 0) => {
    const currentId = id.toString();
    id += 1;

    nodes.push({
      id: currentId,
      data: { label: node.text },
      position: { x: depth * 250, y: (id - 1) * 150 },
      style: {
        padding: '10px',
        backgroundColor: '#f0f8ff',
        border: '2px solid #1f1f1f',
        borderRadius: '8px',
        fontSize: '14px',
        textAlign: 'center',
      },
    });

    if (parentId !== null) {
      edges.push({
        id: `e${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        type: 'smoothstep',
        animated: true,
        style: { strokeWidth: 2, stroke: '#1f1f1f' },
      });
    }

    node.children.forEach((child) => traverse(child, currentId, depth + 1));
  };

  tree.forEach((node) => traverse(node));

  return [...nodes, ...edges];
};

const MindMap: React.FC<MindMapProps> = ({ input }) => {
  const [elements, setElements] = useState<(Node | Edge)[]>([]);

  useEffect(() => {
    const tree = parseInput(input);
    const flowElements = createElements(tree);
    setElements(flowElements);
  }, [input]);

  const handleNodeDragStop = (event: any, node: any) => {
    // Handle drag stop logic here, e.g., update the node position
    console.log('Node dragged:', node);
  };

  return (
    // Wrap ReactFlow with ReactFlowProvider to resolve Zustand error
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '800px' }}>
        <ReactFlow
          nodes={elements.filter((e) => 'data' in e) as Node[]}
          edges={elements.filter((e) => 'source' in e) as Edge[]}
          fitView
          nodesDraggable={true} // Allow nodes to be draggable
          nodesConnectable={false}
          elementsSelectable={true}
          onNodeDragStop={handleNodeDragStop} // Handle drag stop
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default MindMap;
