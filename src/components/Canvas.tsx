import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { 
  Play, 
  Trash2, 
  Copy, 
  Settings, 
  Plus, 
  Minus, 
  Maximize2, 
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Workflow as WorkflowIcon,
  Layers,
  CheckCircle,
  XCircle,
  X,
  Activity,
  User,
  ArrowRight,
  Clock
} from "lucide-react";
import { 
  WorkflowNode, 
  WorkflowEdge, 
  NodeType, 
  NodeConfig 
} from "../types";

// Get appropriate icons for each node type
import { 
  Play as StartIcon, 
  Square as EndIcon, 
  Terminal as PromptIcon, 
  Cpu as GeminiIcon, 
  Database as MemoryIcon, 
  BookOpen as KnowledgeBaseIcon, 
  Search as RetrieverIcon, 
  Wrench as ToolIcon, 
  Globe as ApiIcon, 
  Database as DatabaseIcon, 
  GitFork as ConditionIcon, 
  Repeat as LoopIcon, 
  Code as FunctionIcon, 
  Mail as EmailIcon,  
  Radio as WebhookIcon, 
  Milestone as VectorSearchIcon, 
  Users as HumanApprovalIcon, 
  FileText as OutputIcon, 
  Box as CustomIcon 
} from "lucide-react";

const nodeTypeSpecs: Record<NodeType, { label: string; desc: string; color: string; icon: any }> = {
  start: { label: "Start Automation", desc: "Where the flow begins", color: "#10B981", icon: StartIcon },
  end: { label: "Finish Automation", desc: "Where the flow ends", color: "#F43F5E", icon: EndIcon },
  prompt: { label: "Instructions", desc: "Provide details for the AI", color: "#14B8A6", icon: PromptIcon },
  gemini: { label: "AI Brain", desc: "Processes your requests", color: "#8B5CF6", icon: GeminiIcon },
  memory: { label: "Remember Info", desc: "Keeps track of details", color: "#F59E0B", icon: MemoryIcon },
  knowledge_base: { label: "Source Files", desc: "Connect your PDFs & folders", color: "#6366F1", icon: KnowledgeBaseIcon },
  retriever: { label: "Search Files", desc: "Finds answers inside files", color: "#3B82F6", icon: RetrieverIcon },
  tool: { label: "Search Google", desc: "Gather real-time web info", color: "#EC4899", icon: ToolIcon },
  api: { label: "Connect App", desc: "Integrate your favorite services", color: "#06B6D4", icon: ApiIcon },
  database: { label: "Save Data", desc: "Spreadsheets or tables", color: "#6366F1", icon: DatabaseIcon },
  condition: { label: "If this happens", desc: "Splits path based on custom rule", color: "#EF4444", icon: ConditionIcon },
  loop: { label: "Repeat Task", desc: "Loop through items in order", color: "#F59E0B", icon: LoopIcon },
  function: { label: "Custom Rule", desc: "Apply unique automation rules", color: "#10B981", icon: FunctionIcon },
  http_request: { label: "Call Website", desc: "Fetch or send web data", color: "#7C3AED", icon: ApiIcon },
  email: { label: "Send Email", desc: "Send an automated email", color: "#0EA5E9", icon: EmailIcon },
  webhook: { label: "Receive Information", desc: "Starts when info is received", color: "#F43F5E", icon: WebhookIcon },
  vector_search: { label: "Semantic Match", desc: "Compare concepts intelligently", color: "#D946EF", icon: VectorSearchIcon },
  human_approval: { label: "Review Step", desc: "Wait for your green light", color: "#F97316", icon: HumanApprovalIcon },
  output: { label: "Record Result", desc: "Save results of the run", color: "#14B8A6", icon: OutputIcon },
  custom: { label: "Unique Model", desc: "Use a custom AI setup", color: "#64748B", icon: CustomIcon }
};

const getSmartDescription = (node: WorkflowNode): string => {
  switch (node.type) {
    case "start":
      return "Waits for a new incoming trigger or webhook.";
    case "prompt":
      return "Compiles your plain-English instructions for the AI.";
    case "gemini":
      return "Uses Google Gemini AI to analyze, classify or translate.";
    case "condition":
      return "Splits the flow depending on simple custom rules.";
    case "tool":
      return "Queries Google Search for fresh web information.";
    case "function":
      return "Structures and filters custom payload variables.";
    case "output":
      return "Compiles and formats the final automation run output.";
    case "database":
      return "Stores or appends the data directly into Google Sheets.";
    case "email":
      return "Sends an automatic email notification via SMTP.";
    case "webhook":
      return "Listens for instant information from external systems.";
    case "http_request":
      return "Triggers a web call to retrieve external content.";
    default:
      return "Executes custom logic for this automation step.";
  }
};

interface CanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateNodes: (nodes: WorkflowNode[]) => void;
  onUpdateEdges: (edges: WorkflowEdge[]) => void;
  onUpdateNodesAndEdges?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  snapToGrid: boolean;
  onAddLog: (nodeId: string, nodeLabel: string, nodeType: NodeType, status: 'running' | 'completed' | 'failed' | 'waiting', duration: number, output?: string, tokens?: number) => void;
  showAiAssistant: boolean;
  onToggleAiAssistant: () => void;
}

export default function Canvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodes,
  onUpdateEdges,
  onUpdateNodesAndEdges,
  snapToGrid,
  onAddLog,
  showAiAssistant,
  onToggleAiAssistant
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Transform State (Pan & Zoom)
  const [pan, setPan] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Spacebar panning state
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Marquee (Selection box) state
  const [marqueeStart, setMarqueeStart] = useState<{ x: number; y: number } | null>(null);
  const [marqueeEnd, setMarqueeEnd] = useState<{ x: number; y: number } | null>(null);

  // Smart Alignment Guides State
  const [alignGuideX, setAlignGuideX] = useState<number | null>(null);
  const [alignGuideY, setAlignGuideY] = useState<number | null>(null);

  // Node Dragging State
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node Connection State
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Floating Context Menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string | null } | null>(null);

  // Floating Add Node Palette State
  const [showNodePicker, setShowNodePicker] = useState(false);

  // Quick sequential block append state (n8n-style)
  const [quickAppendSourceId, setQuickAppendSourceId] = useState<string | null>(null);

  // Keyboard Delete & Space-panning Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId && !isInput) {
        deleteNode(selectedNodeId);
      }

      if (e.code === "Space" && !isInput) {
        e.preventDefault();
        setIsSpacePressed(true);
      }

      // Zoom in: '+' or '='
      if ((e.key === "=" || e.key === "+") && !isInput) {
        e.preventDefault();
        setZoom(prevZoom => {
          const containerWidth = containerRef.current?.clientWidth || 800;
          const containerHeight = containerRef.current?.clientHeight || 600;
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;
          const nextZoom = Math.min(prevZoom + 0.1, 3.0);
          setPan(prevPan => {
            const newPanX = centerX - (centerX - prevPan.x) * (nextZoom / prevZoom);
            const newPanY = centerY - (centerY - prevPan.y) * (nextZoom / prevZoom);
            return { x: newPanX, y: newPanY };
          });
          return parseFloat(nextZoom.toFixed(2));
        });
      }

      // Zoom out: '-'
      if (e.key === "-" && !isInput) {
        e.preventDefault();
        setZoom(prevZoom => {
          const containerWidth = containerRef.current?.clientWidth || 800;
          const containerHeight = containerRef.current?.clientHeight || 600;
          const centerX = containerWidth / 2;
          const centerY = containerHeight / 2;
          const nextZoom = Math.max(prevZoom - 0.1, 0.15);
          setPan(prevPan => {
            const newPanX = centerX - (centerX - prevPan.x) * (nextZoom / prevZoom);
            const newPanY = centerY - (centerY - prevPan.y) * (nextZoom / prevZoom);
            return { x: newPanX, y: newPanY };
          });
          return parseFloat(nextZoom.toFixed(2));
        });
      }

      // Reset Zoom: '0'
      if (e.key === "0" && !isInput) {
        e.preventDefault();
        setZoom(0.85);
        setPan({ x: 100, y: 100 });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedNodeId, nodes, edges]);

  // Handle zooming using wheel gesture
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Mouse coordinates relative to the container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom damping factor
    const zoomIntensity = 0.001;
    let factor = Math.exp(-e.deltaY * zoomIntensity);

    // Clamp factor to avoid crazy rapid zoom on spin wheels
    factor = Math.max(0.92, Math.min(1.08, factor));

    let newZoom = zoom * factor;
    newZoom = Math.max(0.15, Math.min(3.0, newZoom));

    // Calculate new pans to keep the point under the mouse stable
    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(parseFloat(newZoom.toFixed(2)));
    setPan({ x: newPanX, y: newPanY });
  };

  // Fit all nodes perfectly on the screen with n8n-style padding
  const handleFitToScreen = () => {
    if (!nodes || nodes.length === 0) {
      setZoom(0.85);
      setPan({ x: 100, y: 100 });
      return;
    }

    const containerWidth = containerRef.current?.clientWidth || 800;
    const containerHeight = containerRef.current?.clientHeight || 600;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    });

    // Add node boundaries (width ~250px, height ~120px)
    maxX += 250;
    maxY += 120;

    const flowWidth = maxX - minX;
    const flowHeight = maxY - minY;

    const centerX = minX + flowWidth / 2;
    const centerY = minY + flowHeight / 2;

    const paddingFactor = 0.82; // Leave margin around bounds
    const zoomX = (containerWidth * paddingFactor) / flowWidth;
    const zoomY = (containerHeight * paddingFactor) / flowHeight;

    let newZoom = Math.min(zoomX, zoomY);
    newZoom = Math.max(0.2, Math.min(1.4, newZoom)); // Clamp zoom level
    newZoom = parseFloat(newZoom.toFixed(2));

    const newPanX = containerWidth / 2 - centerX * newZoom;
    const newPanY = containerHeight / 2 - centerY * newZoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Drag Canvas / Pan / Marquee Start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking target is a connection handle, ignore panning
    const target = e.target as HTMLElement;
    if (target.closest(".connection-handle") || target.closest(".node-body") || target.closest(".config-button") || target.closest(".add-node-btn")) {
      return;
    }

    if (isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setContextMenu(null);
    } else if (e.button === 0) {
      // Start marquee selection on empty space
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const clientXOnCanvas = (e.clientX - rect.left - pan.x) / zoom;
        const clientYOnCanvas = (e.clientY - rect.top - pan.y) / zoom;
        setMarqueeStart({ x: clientXOnCanvas, y: clientYOnCanvas });
        setMarqueeEnd({ x: clientXOnCanvas, y: clientYOnCanvas });
        onSelectNode(null); // deselect
      }
      setContextMenu(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Relative mouse coordinate in canvas scale
    const clientXOnCanvas = (e.clientX - rect.left - pan.x) / zoom;
    const clientYOnCanvas = (e.clientY - rect.top - pan.y) / zoom;

    // Connection line tracking
    if (connectingSourceId) {
      setMousePosition({ x: clientXOnCanvas, y: clientYOnCanvas });
    }

    // Marquee tracking
    if (marqueeStart) {
      setMarqueeEnd({ x: clientXOnCanvas, y: clientYOnCanvas });
      
      const x1 = Math.min(marqueeStart.x, clientXOnCanvas);
      const x2 = Math.max(marqueeStart.x, clientXOnCanvas);
      const y1 = Math.min(marqueeStart.y, clientYOnCanvas);
      const y2 = Math.max(marqueeStart.y, clientYOnCanvas);

      // Select first node that falls inside selection box
      const targetNode = nodes.find(n => n.x >= x1 && n.x <= x2 && n.y >= y1 && n.y <= y2);
      if (targetNode) {
        onSelectNode(targetNode.id);
      }
    }

    // Panning canvas
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }

    // Dragging standard nodes
    if (draggedNodeId) {
      const node = nodes.find(n => n.id === draggedNodeId);
      if (node) {
        let newX = clientXOnCanvas - dragStart.x;
        let newY = clientYOnCanvas - dragStart.y;

        // Smart alignment guides & magnetic snapping
        let snappedX: number | null = null;
        let snappedY: number | null = null;

        for (const other of nodes) {
          if (other.id === draggedNodeId) continue;

          // Align X coordinate
          if (Math.abs(newX - other.x) < 14) {
            snappedX = other.x;
          }
          // Align Y coordinate
          if (Math.abs(newY - other.y) < 14) {
            snappedY = other.y;
          }
        }

        if (snappedX !== null) {
          newX = snappedX;
          setAlignGuideX(snappedX);
        } else {
          setAlignGuideX(null);
        }

        if (snappedY !== null) {
          newY = snappedY;
          setAlignGuideY(snappedY);
        } else {
          setAlignGuideY(null);
        }

        if (snapToGrid) {
          newX = Math.round(newX / 20) * 20;
          newY = Math.round(newY / 20) * 20;
        }

        onUpdateNodes(nodes.map(n => n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
    setMarqueeStart(null);
    setMarqueeEnd(null);
    setAlignGuideX(null);
    setAlignGuideY(null);
  };

  // Node Drag Trigger
  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    onSelectNode(nodeId);
    setContextMenu(null);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const clientXOnCanvas = (e.clientX - rect.left - pan.x) / zoom;
      const clientYOnCanvas = (e.clientY - rect.top - pan.y) / zoom;
      
      setDraggedNodeId(nodeId);
      setDragStart({
        x: clientXOnCanvas - node.x,
        y: clientYOnCanvas - node.y
      });
    }
  };

  // Node Connection Trigger
  const handleHandleClick = (e: React.MouseEvent, nodeId: string, type: 'source' | 'target') => {
    e.stopPropagation();
    setContextMenu(null);

    if (type === 'source') {
      setConnectingSourceId(nodeId);
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setMousePosition({ x: node.x + 240, y: node.y + 45 });
      }
    } else {
      // Seal connection
      if (connectingSourceId && connectingSourceId !== nodeId) {
        // Prevent duplicate edges
        const exists = edges.some(edge => edge.source === connectingSourceId && edge.target === nodeId);
        if (!exists) {
          const newEdge: WorkflowEdge = {
            id: `edge_${Date.now()}`,
            source: connectingSourceId,
            target: nodeId,
            animated: true
          };
          onUpdateEdges([...edges, newEdge]);
          onAddLog(nodeId, "Edge Connect", "custom", "completed", 50, `Successfully linked source [${connectingSourceId}] output port to target [${nodeId}] input port.`);
        }
      }
      setConnectingSourceId(null);
    }
  };

  // Delete node and its corresponding edges
  const deleteNode = (id: string) => {
    const nextNodes = nodes.filter(n => n.id !== id);
    const nextEdges = edges.filter(edge => edge.source !== id && edge.target !== id);
    if (onUpdateNodesAndEdges) {
      onUpdateNodesAndEdges(nextNodes, nextEdges);
    } else {
      onUpdateNodes(nextNodes);
      onUpdateEdges(nextEdges);
    }
    if (selectedNodeId === id) {
      onSelectNode(null);
    }
    setContextMenu(null);
  };

  // Duplicate node
  const duplicateNode = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      const copy: WorkflowNode = {
        ...node,
        id: `node_${Date.now()}`,
        x: node.x + 50,
        y: node.y + 50,
        label: `${node.label} (Copy)`,
        status: 'idle',
        executionTime: undefined,
        output: undefined
      };
      onUpdateNodes([...nodes, copy]);
      onSelectNode(copy.id);
    }
    setContextMenu(null);
  };

  // Clear specific edge
  const deleteEdge = (id: string) => {
    onUpdateEdges(edges.filter(e => e.id !== id));
  };

  // Auto-align node positions topological helper
  const handleTriggerAutoLayout = (currentNodes: WorkflowNode[] = nodes, currentEdges: WorkflowEdge[] = edges) => {
    const nodesCopy = [...currentNodes];
    const layers: Record<string, number> = {};
    const visited = new Set<string>();

    const startNodes = nodesCopy.filter(n => n.type === 'start' || !currentEdges.some(e => e.target === n.id));
    
    let currentQueue = [...startNodes];
    let currentLayer = 0;

    while (currentQueue.length > 0) {
      const nextQueue: typeof currentQueue = [];
      currentQueue.forEach(node => {
        layers[node.id] = currentLayer;
        visited.add(node.id);

        const childrenEdges = currentEdges.filter(e => e.source === node.id);
        childrenEdges.forEach(e => {
          if (!visited.has(e.target)) {
            const targetNode = nodesCopy.find(n => n.id === e.target);
            if (targetNode && !nextQueue.some(q => q.id === targetNode.id)) {
              nextQueue.push(targetNode);
            }
          }
        });
      });
      currentQueue = nextQueue;
      currentLayer++;
    }

    nodesCopy.forEach(n => {
      if (layers[n.id] === undefined) {
        layers[n.id] = currentLayer;
      }
    });

    const totalInLayer: Record<number, number> = {};
    nodesCopy.forEach(node => {
      const layer = layers[node.id] ?? 0;
      totalInLayer[layer] = (totalInLayer[layer] ?? 0) + 1;
    });

    const layerIndices: Record<number, number> = {};
    const updatedNodes = nodesCopy.map(node => {
      const layer = layers[node.id] ?? 0;
      const indexInLayer = layerIndices[layer] ?? 0;
      layerIndices[layer] = indexInLayer + 1;

      const totalNodesInThisLayer = totalInLayer[layer] ?? 1;

      const spacingX = 320;
      const spacingY = 160;
      const startX = 100;
      const centerY = 220;

      const x = startX + layer * spacingX;
      const y = centerY - ((totalNodesInThisLayer - 1) * spacingY) / 2 + indexInLayer * spacingY;

      return { ...node, x, y };
    });

    onUpdateNodes(updatedNodes);
  };

  // n8n-style Quick Sequential Append Node method
  const handleQuickAppend = (sourceId: string, type: NodeType) => {
    const sourceNode = nodes.find(n => n.id === sourceId);
    if (!sourceNode) return;

    const spec = nodeTypeSpecs[type];
    const newId = `${type}_${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newId,
      type,
      label: spec.label,
      description: spec.desc,
      x: sourceNode.x + 320,
      y: sourceNode.y,
      width: 250,
      height: 90,
      color: spec.color,
      config: getNewNodeConfig(type),
      status: 'idle'
    };

    const newEdge: WorkflowEdge = {
      id: `edge_${Date.now()}`,
      source: sourceId,
      target: newId,
      animated: true
    };

    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [...edges, newEdge];

    onUpdateNodes(updatedNodes);
    onUpdateEdges(updatedEdges);
    setQuickAppendSourceId(null);
    onSelectNode(newId);
    onAddLog(newId, spec.label, type, "waiting", 30, `Successfully appended sequential [${spec.label}] node block.`);

    setTimeout(() => {
      handleTriggerAutoLayout(updatedNodes, updatedEdges);
    }, 50);
  };

  // Add specific Node from Floating Palette
  const addNode = (type: NodeType) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const centerX = rect ? (rect.width / 2 - pan.x) / zoom - 120 : 250;
    const centerY = rect ? (rect.height / 2 - pan.y) / zoom - 45 : 180;

    const spec = nodeTypeSpecs[type];
    const newNode: WorkflowNode = {
      id: `${type}_${Date.now()}`,
      type,
      label: spec.label,
      description: spec.desc,
      x: centerX,
      y: centerY,
      width: 250,
      height: 90,
      color: spec.color,
      config: getNewNodeConfig(type),
      status: 'idle'
    };

    onUpdateNodes([...nodes, newNode]);
    onSelectNode(newNode.id);
  };

  const getNewNodeConfig = (type: NodeType): NodeConfig => {
    switch (type) {
      case "prompt":
        return {
          promptTemplate: "Review the system payload context:\n{{input}}\n\nDraft a summary focusing on optimization vectors.",
          variables: [{ name: "input", value: "" }],
          temperature: 0.5,
          model: "gemini-3.5-flash",
          systemPrompt: "You are an expert compiler engineer.",
          outputFormat: "text"
        };
      case "gemini":
        return {
          geminiModel: "gemini-3.5-flash",
          geminiTemperature: 0.2,
          geminiMaxTokens: 1024,
          systemPrompt: "Answer concisely."
        };
      case "memory":
        return {
          memoryType: "conversation",
          memoryKey: "chat_history",
          knowledgeSource: "In-memory JSON context"
        };
      case "retriever":
        return {
          topK: 3,
          embeddingSearch: true,
          chunkSize: 512,
          similarityThreshold: 0.75
        };
      case "tool":
        return {
          toolName: "GoogleSearchGrounding",
          authType: "none",
          retries: 3,
          timeout: 5000,
          parameters: [{ name: "query", type: "string", description: "Search query string", value: "latest AI frameworks" }]
        };
      default:
        return {};
    }
  };

  // Right click Custom Context Menu
  const handleContextMenu = (e: React.MouseEvent, nodeId: string | null) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      nodeId
    });
  };

  // Helper bezier formula for edges
  const getBezierPath = (startX: number, startY: number, endX: number, endY: number) => {
    const dx = Math.abs(endX - startX) * 0.5;
    return `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => handleContextMenu(e, null)}
      className="flex-1 bg-[#080B0F] h-full relative overflow-hidden outline-none select-none transition-colors duration-200"
      style={{ cursor: isPanning ? "grabbing" : isSpacePressed ? "grab" : "default" }}
    >
      {/* Visual Canvas Grid */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-75 opacity-70"
        style={{
          backgroundImage: "radial-gradient(#1e293b 1.2px, transparent 1.2px)",
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      ></div>

      {/* Alignment Guides */}
      {alignGuideX !== null && (
        <div 
          className="absolute w-[1px] border-l border-dashed border-blue-500/60 z-15 pointer-events-none"
          style={{
            left: `${alignGuideX * zoom + pan.x}px`,
            top: 0,
            bottom: 0,
          }}
        />
      )}
      {alignGuideY !== null && (
        <div 
          className="absolute h-[1px] border-t border-dashed border-blue-500/60 z-15 pointer-events-none"
          style={{
            top: `${alignGuideY * zoom + pan.y}px`,
            left: 0,
            right: 0,
          }}
        />
      )}

      {/* Marquee Selection Box */}
      {marqueeStart && marqueeEnd && (
        <div 
          className="absolute border border-blue-500/50 bg-blue-500/10 pointer-events-none z-30 rounded-xs"
          style={{
            left: `${Math.min(marqueeStart.x, marqueeEnd.x) * zoom + pan.x}px`,
            top: `${Math.min(marqueeStart.y, marqueeEnd.y) * zoom + pan.y}px`,
            width: `${Math.abs(marqueeStart.x - marqueeEnd.x) * zoom}px`,
            height: `${Math.abs(marqueeStart.y - marqueeEnd.y) * zoom}px`
          }}
        />
      )}

      {/* Floating Add Node Palette Drawer */}
      {showNodePicker ? (
        <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 p-3 bg-[#0B0F14]/95 border border-gray-800 rounded-xl backdrop-blur-md max-h-[85%] overflow-y-auto w-56 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">Node Library</span>
            </div>
            <button 
              onClick={() => setShowNodePicker(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 mt-2">
            {(Object.keys(nodeSpecsGrouped) as Array<keyof typeof nodeSpecsGrouped>).map((groupName) => (
              <div key={groupName} className="space-y-1">
                <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest pl-1 pt-2">{groupName}</div>
                {nodeSpecsGrouped[groupName].map((type) => {
                  const spec = nodeTypeSpecs[type];
                  const Icon = spec.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        addNode(type);
                        setShowNodePicker(false); // Close node picker after selecting a node as requested
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-gray-300 hover:text-white hover:bg-gray-800/60 border border-transparent hover:border-gray-800 transition-all text-xs cursor-pointer group"
                    >
                      <div 
                        className="p-1 rounded text-white group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: `${spec.color}20`, color: spec.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-[11px] leading-none">{spec.label}</div>
                        <div className="text-[9px] text-gray-500 truncate mt-0.5">{spec.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2.5">
          <button
            onClick={() => setShowNodePicker(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Add Block"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleAiAssistant}
            className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              showAiAssistant 
                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20" 
                : "bg-[#0B0F14]/95 border border-slate-800 text-purple-400 hover:text-purple-300 hover:bg-slate-900"
            }`}
            title="AI Automation Assistant"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      )}

      {/* RENDER CANVAS CONTENT (NODES & WIRES) */}
      <div 
        className="absolute inset-0 pointer-events-auto transform-gpu origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        
        {/* SVG CONTAINER FOR WIRES */}
        <svg className="absolute inset-0 overflow-visible pointer-events-none z-0">
          <defs>
            <marker
              id="arrow-std"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4B5563" />
            </marker>
            <marker
              id="arrow-completed"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3B82F6" />
            </marker>
            <marker
              id="arrow-running"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#9333EA" />
            </marker>
          </defs>

          {/* Active Wires */}
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            // Compute connection handle locations
            const startX = sourceNode.x + 250;
            const startY = sourceNode.y + 45;
            const endX = targetNode.x;
            const endY = targetNode.y + 45;

            const pathD = getBezierPath(startX, startY, endX, endY);

            // Edge execution animations
            const isSourceCompleted = sourceNode.status === 'completed';
            const isSourceRunning = sourceNode.status === 'running';

            return (
              <g key={edge.id} className="group pointer-events-auto">
                {/* Highlight/Hover wire click handler */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={15}
                  onClick={() => deleteEdge(edge.id)}
                  className="cursor-pointer"
                  title="Click to remove connection wire"
                />
                
                {/* Visible base path with arrow direction marker */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSourceCompleted ? "#3B82F6" : isSourceRunning ? "#9333EA" : "#374151"}
                  strokeWidth={2}
                  markerEnd={isSourceCompleted ? "url(#arrow-completed)" : isSourceRunning ? "url(#arrow-running)" : "url(#arrow-std)"}
                  className="transition-colors duration-300"
                />

                {/* Animated dash array traveling packet if source node is executed */}
                {isSourceCompleted && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    strokeDasharray="6, 6"
                    className="animate-[dash_10s_linear_infinite]"
                  />
                )}

                {/* Executing packet animation circle */}
                {isSourceRunning && (
                  <circle r={4} fill="#C084FC" className="animate-[travel_1.5s_infinite]">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path={pathD} />
                  </circle>
                )}
              </g>
            );
          })}

          {/* User currently dragging a visual tentative wire */}
          {connectingSourceId && (() => {
            const sourceNode = nodes.find(n => n.id === connectingSourceId);
            if (!sourceNode) return null;
            const startX = sourceNode.x + 250;
            const startY = sourceNode.y + 45;
            return (
              <path
                d={getBezierPath(startX, startY, mousePosition.x, mousePosition.y)}
                fill="none"
                stroke="#60A5FA"
                strokeWidth={2}
                strokeDasharray="4, 4"
              />
            );
          })()}
        </svg>

        {/* ABSOLUTE NODE ELEMENTS CONTAINER */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {nodes.map((node) => {
            const spec = nodeTypeSpecs[node.type];
            const Icon = spec.icon;
            const isSelected = selectedNodeId === node.id;
            const isCompleted = node.status === 'completed';
            const isRunning = node.status === 'running';
            const isFailed = node.status === 'failed';

            return (
              <div
                key={node.id}
                onContextMenu={(e) => handleContextMenu(e, node.id)}
                className={`absolute w-[250px] bg-[#0B0F14]/95 border rounded-xl pointer-events-auto transition-all shadow-2xl flex flex-col select-none group/node ${
                  isSelected 
                    ? "border-blue-500 ring-1 ring-blue-500/30 shadow-blue-500/10" 
                    : isRunning 
                    ? "border-purple-500 ring-2 ring-purple-500/20 animate-pulse"
                    : isCompleted
                    ? "border-emerald-500/80 shadow-emerald-500/5"
                    : isFailed
                    ? "border-red-500 shadow-red-500/5"
                    : "border-gray-800/80 hover:border-gray-700"
                }`}
                style={{ 
                  left: `${node.x}px`, 
                  top: `${node.y}px`,
                }}
              >
                
                {/* Target Handle (Left input anchor) */}
                {node.type !== 'start' && (
                  <div
                    onClick={(e) => handleHandleClick(e, node.id, 'target')}
                    className="connection-handle absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0B0F14] border border-gray-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 cursor-crosshair transition-colors group"
                    title="Connect input port"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-white"></div>
                  </div>
                )}

                {/* Source Handle (Right output anchor) */}
                {node.type !== 'end' && (
                  <>
                    <div
                      onClick={(e) => handleHandleClick(e, node.id, 'source')}
                      className="connection-handle absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0B0F14] border border-gray-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-400 cursor-crosshair transition-colors group"
                      title="Drag output port connection"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-white"></div>
                    </div>

                    {/* n8n-style Quick Append Node Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickAppendSourceId(quickAppendSourceId === node.id ? null : node.id);
                      }}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-md shadow-blue-500/20 group-hover/node:opacity-100 opacity-0 z-30"
                      title="Append next block"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    {quickAppendSourceId === node.id && (
                      <div 
                        className="absolute left-full ml-10 top-1/2 -translate-y-1/2 z-50 bg-[#0B0F14]/95 border border-gray-800 rounded-xl shadow-2xl p-2.5 w-48 backdrop-blur-md text-gray-300 text-left cursor-default select-none animate-in fade-in zoom-in-95 duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50 pb-1.5 mb-1.5">
                          Append Next Node
                        </div>
                        <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                          {Object.keys(nodeTypeSpecs).filter(t => t !== 'start').map((type) => {
                            const tSpec = nodeTypeSpecs[type as NodeType];
                            const TIcon = tSpec.icon;
                            return (
                              <button
                                key={type}
                                onClick={() => {
                                  handleQuickAppend(node.id, type as NodeType);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800 hover:text-white transition-colors text-xs text-left cursor-pointer"
                              >
                                <TIcon className="w-3 h-3" style={{ color: tSpec.color }} />
                                <span className="truncate">{tSpec.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Node Dragging Header */}
                <div
                  onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                  className="px-3.5 py-2 rounded-t-xl bg-[#080B0F]/70 border-b border-gray-800/50 flex items-center justify-between cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div 
                      className="p-1 rounded text-white"
                      style={{ backgroundColor: `${spec.color}15`, color: spec.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-[11px] tracking-wide truncate">{node.label}</span>
                  </div>

                  {/* Status Indicator lights */}
                  <div className="flex items-center gap-1.5">
                    {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>}
                    {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    {isFailed && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                    
                    {/* Node Config Panel trigger */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectNode(node.id); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="config-button p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors cursor-pointer"
                      title="Configure node"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete node trigger */}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Node Description Body */}
                <div 
                  onClick={(e) => { e.stopPropagation(); onSelectNode(node.id); }}
                  className="p-3.5 node-body flex-1 text-left cursor-pointer"
                >
                  <p className="text-[10px] text-gray-400 leading-normal">{node.description}</p>
                  
                  {/* Dynamic Inline stats preview when execution complete */}
                  {node.executionTime !== undefined && (
                    <div className="mt-2.5 flex items-center justify-between text-[8px] font-mono text-gray-500 border-t border-gray-800/40 pt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-blue-500" />
                        Latency: {node.executionTime}ms
                      </span>
                      {node.output && (
                        <span className="text-emerald-400 tracking-wider truncate max-w-[110px]">
                          Output generated
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Canvas Scale zoom and Pan indicator controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-2 bg-[#0B0F14]/90 border border-gray-800 rounded-xl backdrop-blur-md shadow-2xl">
        <button
          onClick={() => {
            const containerWidth = containerRef.current?.clientWidth || 800;
            const containerHeight = containerRef.current?.clientHeight || 600;
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const newZoom = Math.max(zoom - 0.1, 0.15);
            const newPanX = centerX - (centerX - pan.x) * (newZoom / zoom);
            const newPanY = centerY - (centerY - pan.y) * (newZoom / zoom);
            setZoom(parseFloat(newZoom.toFixed(2)));
            setPan({ x: newPanX, y: newPanY });
          }}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-mono text-gray-400 w-12 text-center select-none font-bold">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => {
            const containerWidth = containerRef.current?.clientWidth || 800;
            const containerHeight = containerRef.current?.clientHeight || 600;
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const newZoom = Math.min(zoom + 0.1, 3.0);
            const newPanX = centerX - (centerX - pan.x) * (newZoom / zoom);
            const newPanY = centerY - (centerY - pan.y) * (newZoom / zoom);
            setZoom(parseFloat(newZoom.toFixed(2)));
            setPan({ x: newPanX, y: newPanY });
          }}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <div className="h-4 w-[1px] bg-gray-800 mx-1"></div>
        <button
          onClick={handleFitToScreen}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Fit to Screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setPan({ x: 100, y: 100 }); setZoom(0.85); }}
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Reset View"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <div className="h-4 w-[1px] bg-gray-800 mx-1"></div>
        <button
          onClick={() => handleTriggerAutoLayout()}
          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition-all text-[10px] font-mono font-bold uppercase cursor-pointer flex items-center gap-1 shadow-md shadow-blue-600/10"
          title="Align and clean entire workflow sequentially like n8n"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Align Flow</span>
        </button>
      </div>



      {/* CUSTOM FLOATING CONTEXT MENU */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-[#0B0F14]/95 border border-gray-800 rounded-lg shadow-2xl py-1.5 w-44 backdrop-blur-md text-gray-300 text-xs"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
        >
          {contextMenu.nodeId ? (
            <>
              <button
                onClick={() => duplicateNode(contextMenu.nodeId!)}
                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-800 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                Duplicate Node
              </button>
              <button
                onClick={() => deleteNode(contextMenu.nodeId!)}
                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-800 hover:text-red-400 flex items-center gap-2 text-red-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                Delete Node
              </button>
            </>
          ) : (
            <>
              <div className="px-3.5 py-1 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50 pb-1.5 mb-1">
                Insert Quick Node
              </div>
              <button
                onClick={() => { addNode('prompt'); setContextMenu(null); }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-800 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <PromptIcon className="w-3.5 h-3.5 text-teal-400" />
                Add Prompt compiler
              </button>
              <button
                onClick={() => { addNode('gemini'); setContextMenu(null); }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-800 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <GeminiIcon className="w-3.5 h-3.5 text-purple-400" />
                Add Gemini engine
              </button>
              <button
                onClick={() => { addNode('tool'); setContextMenu(null); }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-800 hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <ToolIcon className="w-3.5 h-3.5 text-pink-400" />
                Add Web Search Tool
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
}

// Group nodes by category for the sidebar library drawer
const nodeSpecsGrouped: Record<string, NodeType[]> = {
  "Core blocks": ["start", "end", "output"],
  "AI & Prompts": ["prompt", "gemini", "custom"],
  "RAG & Memory": ["memory", "knowledge_base", "retriever", "vector_search"],
  "Utilities & Tools": ["tool", "api", "database", "function", "http_request"],
  "Control Flow": ["condition", "loop", "human_approval"],
  "Notification": ["email", "webhook"]
};
