import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

interface MindmapNode {
  name: string;
  children?: MindmapNode[];
}

interface MindmapTreeProps {
  data: MindmapNode;
}

const MindmapTree: React.FC<MindmapTreeProps> = ({ data }) => {
const parseToFlowData = useCallback((node: MindmapNode, parentId?: string) => {
    const id = node.name;
    
    const nodes: Node[] = [
        {
        id,
        data: { label: node.name },
        position: { x: Math.random() * 200, y: Math.random() * 200 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true, // Cho phép kéo
        },
    ];
    
    const edges: Edge[] = parentId
        ? [{ id: `${parentId}-${id}`, source: parentId, target: id }]
        : [];
    
    if (node.children) {
        for (const child of node.children) {
        const childData = parseToFlowData(child, id);
        nodes.push(...childData.nodes);
        edges.push(...childData.edges);
        }
    }
    
    return { nodes, edges };
    }, []);
      

  const { nodes, edges } = useMemo(() => parseToFlowData(data), [data]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true} // Cho phép kéo toàn bộ node
        >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
    </ReactFlow>

    </div>
  );
};

export default MindmapTree;
