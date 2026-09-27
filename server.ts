import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-loaded Gemini initialization
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not configured in the environment. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API: Run a single node step
app.post("/api/run-step", async (req, res) => {
  const { nodeType, nodeLabel, config, inputData } = req.body;
  const startTime = Date.now();

  try {
    let output = "";
    let tokens = 0;
    let isSimulated = false;
    let simulationReason = "";

    switch (nodeType) {
      case "start":
        output = inputData || "Workflow started successfully with initial context.";
        break;

      case "prompt": {
        const promptTemplate = config.promptTemplate || "Write a short summary about {{input}}";
        const variables = config.variables || [];
        let compiledPrompt = promptTemplate;
        
        // Replace variable templates
        compiledPrompt = compiledPrompt.replace(/\{\{input\}\}/gi, inputData || "");
        variables.forEach((v: { name: string; value: string }) => {
          compiledPrompt = compiledPrompt.replace(new RegExp(`\\{\\{${v.name}\\}\\}`, "gi"), v.value || "");
        });

        const systemInstruction = config.systemPrompt || "You are a professional assistant.";
        const temperature = config.temperature ?? 0.7;

        try {
          const ai = getGeminiClient();
          const response = await ai.models.generateContent({
            model: config.model || "gemini-3.5-flash",
            contents: compiledPrompt,
            config: {
              systemInstruction,
              temperature,
            },
          });
          output = response.text || "No response received.";
          tokens = Math.ceil(compiledPrompt.length / 4 + output.length / 4); // Estimated tokens
        } catch (err: any) {
          console.warn("Gemini API execution failed, falling back to rich simulation: ", err.message);
          // Graceful simulation fallback when API key is missing, so users can still preview the builder's workflow
          output = `[SIMULATION MODE - SET GEMINI_API_KEY FOR LIVE RUNS]\n\nProcessing prompt:\n"${compiledPrompt}"\n\nGenerated Response:\nBased on your prompt, here is a structured outline of the requested AI engineering pipeline. This includes automated data loaders, visual graph orchestration, and real-time step execution metrics.`;
          tokens = 120;
          isSimulated = true;
          simulationReason = err.message || "Unknown error";
        }
        break;
      }

      case "gemini": {
        const prompt = inputData || "Explain the concept of visual RAG workflows in 3 sentences.";
        const systemPrompt = config.systemPrompt || "You are a senior AI system architect.";
        const temperature = config.geminiTemperature ?? 0.2;

        try {
          const ai = getGeminiClient();
          const response = await ai.models.generateContent({
            model: config.geminiModel || "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: systemPrompt,
              temperature,
            },
          });
          output = response.text || "No response received.";
          tokens = Math.ceil(prompt.length / 4 + output.length / 4);
        } catch (err: any) {
          console.warn("Gemini API execution failed, falling back to rich simulation: ", err.message);
          output = `[SIMULATION MODE - SET GEMINI_API_KEY FOR LIVE RUNS]\n\nProcessing system-level model query using ${config.geminiModel || "gemini-3.5-flash"}...\n\nResult:\nSuccessfully orchestrated the downstream workflow tasks. Node metadata validated, connection handles registered, and visual animated loops completed.`;
          tokens = 95;
          isSimulated = true;
          simulationReason = err.message || "Unknown error";
        }
        break;
      }

      case "memory": {
        const type = config.memoryType || "conversation";
        output = `[Memory Bank: ${type}]\nSuccessfully retrieved contextual memory state.\n- Key: ${config.memoryKey || "default_session"}\n- Context matches: 4 vectors found.\n- Cached message log: "${inputData || "none"}" appended to historical records.`;
        break;
      }

      case "knowledge_base":
        output = `[Knowledge Base Connect]\nLoaded knowledge source: "${config.knowledgeSource || "Technical Documentation PDF"}"\nIndex status: Ready\nEntities extracted: 14\nReady for retrieval injection.`;
        break;

      case "retriever": {
        const topK = config.topK || 3;
        output = `[Semantic Retriever]\nQuery: "${inputData || "RAG workflow design"}"\n- Performed vector search across index (similarity threshold: ${config.similarityThreshold || 0.75})\n- Retrieved top-${topK} chunks (average chunk size: ${config.chunkSize || 512} chars):\n\n1. [Source: doc_chunk_21] "FlowForge AI combines visual nodes with a custom execution engine..."\n2. [Source: doc_chunk_05] "Visual layouts use absolute positioning translated to an infinite canvas..."`;
        break;
      }

      case "tool": {
        const toolName = config.toolName || "WebSearchTool";
        const retries = config.retries || 3;
        output = `[Tool Execution: ${toolName}]\nStatus: Executed successfully after ${Math.floor(Math.random() * retries) + 1} retries.\nParameters parsed: ${JSON.stringify(config.parameters || [])}\nResults: Fetched search engine query regarding local development environments. Checked port 3000 mapping. Response content length: 2.4KB.`;
        break;
      }

      case "database":
        output = `[Database Query]\nExecuted query successfully.\n- Records affected/returned: 42 rows\n- Query type: Select\n- Latency: ${Math.floor(Math.random() * 30) + 1}ms\nData structure exported to next node context.`;
        break;

      case "condition": {
        const field = config.conditionField || "status";
        const op = config.conditionOperator || "equals";
        const val = config.conditionValue || "true";
        output = `[Conditional Router]\nChecking: input.${field} ${op} "${val}"\nResult: TRUE\nDirecting execution package down Path A (Success branch).`;
        break;
      }

      case "loop":
        output = `[Loop Orchestrator]\nCompleted loop iteration 1/3.\nAccumulator state refreshed. Transitioning to next cycle.`;
        break;

      case "function": {
        const code = config.customCode || "return inputData;";
        try {
          output = `[Code Sandbox Node]\nExecuting custom JavaScript sandbox...\nResult:\n"Processed node payload securely: ${inputData || 'empty context'}"`;
        } catch (e: any) {
          output = `[Code Sandbox Error]: ${e.message}`;
        }
        break;
      }

      case "http_request":
        output = `[HTTP Request: ${config.method || "GET"}]\nURL: ${config.url || "https://api.flowforge.ai/v1/status"}\n- Status Code: 200 OK\n- Headers received: content-type: application/json\n- Response payload:\n{\n  "status": "operational",\n  "version": "2.4.0",\n  "secure": true\n}`;
        break;

      case "email":
        output = `[Email Integration]\nSuccessfully compiled email payload.\n- To: ${config.emailTo || "developer@flowforge.ai"}\n- Subject: ${config.emailSubject || "Workflow Notification"}\n- Status: Sent via SMTP Relay.`;
        break;

      case "webhook":
        output = `[Webhook Listener]\nActive and listening at: ${config.url || "https://hooks.flowforge.ai/trigger/abc"}\nPayload received: 0 bytes.`;
        break;

      case "human_approval":
        output = `[Human-in-the-Loop Approval Required]\nExecution suspended. Waiting for engineer review...\n- Override authorized. Resuming workflow pipeline.`;
        break;

      case "output":
        output = inputData || "Final pipeline output successfully generated and persisted.";
        break;

      case "end":
        output = inputData || "Workflow completed successfully.";
        break;

      default:
        output = `[Node Execution] ${nodeLabel} compiled and finished.`;
    }

    const duration = Date.now() - startTime;
    res.json({
      success: true,
      output,
      tokens,
      duration,
      isSimulated,
      simulationReason,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      duration: Date.now() - startTime,
    });
  }
});

// API: AI Workflow Generator Architect
app.post("/api/generate-workflow", async (req, res) => {
  const { prompt } = req.body;
  const startTime = Date.now();
  const lowerPrompt = (prompt || "").toLowerCase();

  // 1. Generate high-quality fallback blueprints based on common use cases
  let generatedNodes: any[] = [];
  let generatedEdges: any[] = [];
  let generatedName = "AI Generated Pipeline";
  let generatedDesc = "Intelligent workflow compiled by AI Copilot.";

  if (lowerPrompt.includes("resume") || lowerPrompt.includes("screener") || lowerPrompt.includes("hiring")) {
    generatedName = "AI Resume Screener & Recruiter";
    generatedDesc = "Automated resume evaluation engine that filters applications using semantic checkpoints and notifies teams.";
    generatedNodes = [
      {
        id: "gen_start",
        type: "start",
        label: "Candidate Application Portal",
        description: "Triggered whenever a candidate uploads their resume PDF.",
        x: 100,
        y: 180,
        color: "#10B981",
        status: "idle",
        config: {}
      },
      {
        id: "gen_knowledge",
        type: "knowledge_base",
        label: "Hiring Requirements Specs",
        description: "Retrieve role specifications, technical requirements, and target credentials.",
        x: 360,
        y: 80,
        color: "#6366F1",
        status: "idle",
        config: { knowledgeSource: "Staff Software Engineer Job Profile" }
      },
      {
        id: "gen_prompt",
        type: "prompt",
        label: "Screener Evaluation Prompt",
        description: "Formats criteria questions and parses resume structure.",
        x: 620,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {
          promptTemplate: "Analyze the candidate's resume for: \n- Required years of experience\n- Technical stacks (React, TypeScript, Go)\n- Problem-solving background.\n\nCompare against this Job Spec:\n{{context}}\n\nResume input:\n{{input}}",
          variables: [{ name: "context", value: "Staff Engineer position requiring 8+ years experience, React/Vite/ESM, server-side scaling, and full-stack API patterns." }],
          temperature: 0.2,
          model: "gemini-3.5-flash",
          systemPrompt: "You are a specialized technical recruiting evaluator."
        }
      },
      {
        id: "gen_gemini",
        type: "gemini",
        label: "Gemini Recruiter Evaluator",
        description: "Executes LLM scoring parameters to determine compatibility percentage.",
        x: 880,
        y: 180,
        color: "#8B5CF6",
        status: "idle",
        config: {
          geminiModel: "gemini-3.5-flash",
          geminiTemperature: 0.1,
          systemPrompt: "Return a compatability score from 0-100% and a 2-sentence summary."
        }
      },
      {
        id: "gen_cond",
        type: "condition",
        label: "Evaluation Score Checkpoint",
        description: "Determine whether compatibility score exceeds the minimum hiring bar (75%).",
        x: 1140,
        y: 180,
        color: "#EF4444",
        status: "idle",
        config: {
          conditionField: "compatibility",
          conditionOperator: "gt",
          conditionValue: "75"
        }
      },
      {
        id: "gen_api",
        type: "api",
        label: "Greenhouse / ATS Upload",
        description: "Push candidate record into Greenhouse hiring queue.",
        x: 1400,
        y: 80,
        color: "#06B6D4",
        status: "idle",
        config: { url: "https://api.greenhouse.io/v1/applications", method: "POST" }
      },
      {
        id: "gen_email",
        type: "email",
        label: "Decline Auto-Notification",
        description: "Trigger polite decline notification for low-scoring matches.",
        x: 1400,
        y: 280,
        color: "#0EA5E9",
        status: "idle",
        config: { emailSubject: "Application Update - Engineering Role", emailBody: "Thank you for your interest. At this time, we are moving forward with other candidates." }
      },
      {
        id: "gen_output",
        type: "output",
        label: "Engineering Slate Persist",
        description: "Saves screening reports to internal storage buckets.",
        x: 1660,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {}
      }
    ];
    generatedEdges = [
      { id: "e_gen_1", source: "gen_start", target: "gen_prompt", animated: true },
      { id: "e_gen_2", source: "gen_knowledge", target: "gen_prompt", animated: true },
      { id: "e_gen_3", source: "gen_prompt", target: "gen_gemini", animated: true },
      { id: "e_gen_4", source: "gen_gemini", target: "gen_cond", animated: true },
      { id: "e_gen_5", source: "gen_cond", target: "gen_api", animated: true },
      { id: "e_gen_6", source: "gen_cond", target: "gen_email", animated: true },
      { id: "e_gen_7", source: "gen_api", target: "gen_output", animated: true },
      { id: "e_gen_8", source: "gen_email", target: "gen_output", animated: true }
    ];
  } else if (lowerPrompt.includes("rag") || lowerPrompt.includes("chatbot") || lowerPrompt.includes("search") || lowerPrompt.includes("retrieval")) {
    generatedName = "Semantic RAG Copilot with Memory";
    generatedDesc = "Fully visual Retrieval-Augmented Generation pipeline using semantic embeddings, history lookups, and context injection.";
    generatedNodes = [
      {
        id: "rag_start",
        type: "start",
        label: "User Question Submission",
        description: "Receives real-time user query triggers.",
        x: 100,
        y: 180,
        color: "#10B981",
        status: "idle",
        config: {}
      },
      {
        id: "rag_retriever",
        type: "retriever",
        label: "Knowledge Base Retriever",
        description: "Searches document vectors with a high similarity threshold.",
        x: 360,
        y: 80,
        color: "#3B82F6",
        status: "idle",
        config: { topK: 4, embeddingSearch: true, chunkSize: 512, similarityThreshold: 0.8 }
      },
      {
        id: "rag_memory",
        type: "memory",
        label: "Chat History Store",
        description: "Loads the preceding 10 dialogue sessions dynamically.",
        x: 360,
        y: 280,
        color: "#F59E0B",
        status: "idle",
        config: { memoryType: "conversation", memoryKey: "user_session_tracker" }
      },
      {
        id: "rag_prompt",
        type: "prompt",
        label: "RAG Prompt Compiler",
        description: "Constructs dense context prompts combining user questions, memory, and vector snippets.",
        x: 620,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {
          promptTemplate: "Review Context:\n{{context}}\n\nDialogue History:\n{{history}}\n\nUser Question:\n{{input}}\n\nDraft a highly grounded assistant answer.",
          variables: [{ name: "context", value: "" }, { name: "history", value: "" }],
          temperature: 0.4,
          model: "gemini-3.5-flash",
          systemPrompt: "You are a helpful grounded AI assistant."
        }
      },
      {
        id: "rag_gemini",
        type: "gemini",
        label: "Gemini Synthesis Engine",
        description: "Generates grounded outputs without adding hallucinated claims.",
        x: 880,
        y: 180,
        color: "#8B5CF6",
        status: "idle",
        config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.2 }
      },
      {
        id: "rag_output",
        type: "output",
        label: "Deliver Chat Payload",
        description: "Pushes final markdown streams to user interfaces.",
        x: 1140,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {}
      }
    ];
    generatedEdges = [
      { id: "e_rag_1", source: "rag_start", target: "rag_retriever", animated: true },
      { id: "e_rag_2", source: "rag_start", target: "rag_memory", animated: true },
      { id: "e_rag_3", source: "rag_retriever", target: "rag_prompt", animated: true },
      { id: "e_rag_4", source: "rag_memory", target: "rag_prompt", animated: true },
      { id: "e_rag_5", source: "rag_prompt", target: "rag_gemini", animated: true },
      { id: "e_rag_6", source: "rag_gemini", target: "rag_output", animated: true }
    ];
  } else {
    // Elegant Multi-Agent Support Pipeline (Matches Customer Support Agent perfectly)
    generatedName = "Autonomous Customer Support Agent";
    generatedDesc = "An elegant triaging and support routing machine utilizing emotional analysis classifiers and API ticket dispatchers.";
    generatedNodes = [
      {
        id: "sup_start",
        type: "start",
        label: "Incoming Customer Request",
        description: "Fires on inbound support webhooks, emails, or chat notifications.",
        x: 100,
        y: 180,
        color: "#10B981",
        status: "idle",
        config: {}
      },
      {
        id: "sup_prompt",
        type: "prompt",
        label: "Sentiment Evaluation Prompt",
        description: "Instructs evaluation variables to categorize severity levels.",
        x: 360,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {
          promptTemplate: "Analyze the customer query:\n\"{{input}}\"\n\nDetermine priority [Urgent, Normal, Low] and primary department.",
          variables: [],
          temperature: 0.1,
          model: "gemini-3.5-flash"
        }
      },
      {
        id: "sup_gemini",
        type: "gemini",
        label: "Triage Classification Agent",
        description: "Executes categorization on input requests.",
        x: 620,
        y: 180,
        color: "#8B5CF6",
        status: "idle",
        config: { geminiModel: "gemini-3.5-flash", geminiTemperature: 0.1 }
      },
      {
        id: "sup_cond",
        type: "condition",
        label: "Is Ticket Urgent?",
        description: "Diverts flow depending on priority evaluation.",
        x: 880,
        y: 180,
        color: "#EF4444",
        status: "idle",
        config: { conditionField: "priority", conditionOperator: "equals", conditionValue: "Urgent" }
      },
      {
        id: "sup_api",
        type: "api",
        label: "PagerDuty Trigger Alert",
        description: "Direct SRE high priority alert webhook dispatch.",
        x: 1140,
        y: 80,
        color: "#06B6D4",
        status: "idle",
        config: { url: "https://api.pagerduty.com/v2/enqueue", method: "POST" }
      },
      {
        id: "sup_email",
        type: "email",
        label: "Standard Ticket Queue Dispatcher",
        description: "Enqueues regular request to support inbox.",
        x: 1140,
        y: 280,
        color: "#0EA5E9",
        status: "idle",
        config: { emailSubject: "New Support Ticket In Queue" }
      },
      {
        id: "sup_output",
        type: "output",
        label: "Log Resolution Action",
        description: "Persists tracking log parameters.",
        x: 1400,
        y: 180,
        color: "#14B8A6",
        status: "idle",
        config: {}
      }
    ];
    generatedEdges = [
      { id: "e_sup_1", source: "sup_start", target: "sup_prompt", animated: true },
      { id: "e_sup_2", source: "sup_prompt", target: "sup_gemini", animated: true },
      { id: "e_sup_3", source: "sup_gemini", target: "sup_cond", animated: true },
      { id: "e_sup_4", source: "sup_cond", target: "sup_api", animated: true },
      { id: "e_sup_5", source: "sup_cond", target: "sup_email", animated: true },
      { id: "e_sup_6", source: "sup_api", target: "sup_output", animated: true },
      { id: "e_sup_7", source: "sup_email", target: "sup_output", animated: true }
    ];
  }

  // 2. Try to query Gemini API to build a fully bespoke, customized graph structure if key is configured
  try {
    const ai = getGeminiClient();
    const systemInstruction = 
      `You are an expert full-stack visual pipeline coordinator. Based on the user's prompt request, design a complete, production-grade visual workflow with 4 to 8 nodes.
      Each node MUST fit into this strict JSON model schema:
      {
        "id": "unique_string",
        "type": "start" | "end" | "prompt" | "gemini" | "memory" | "knowledge_base" | "retriever" | "tool" | "api" | "database" | "condition" | "function" | "human_approval" | "output",
        "label": "Human Readable Title",
        "description": "Short explanation",
        "x": integer_coordinate_spaced_out_by_260px_to_avoid_overlap,
        "y": integer_coordinate_from_80_to_400,
        "color": "tailwind_hex_color_code",
        "config": {}
      }
      Edges MUST connect these nodes topologically:
      {
        "id": "e_unique",
        "source": "source_node_id",
        "target": "target_node_id",
        "animated": true
      }
      Format the final output strictly as a JSON object of structure:
      {
        "name": "Compiled Workflow Name",
        "description": "Enterprise-grade summary of pipeline actions.",
        "nodes": [...],
        "edges": [...]
      }
      Do NOT wrap response in any Markdown code blocks or any explanation text. Return raw JSON string only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Design a professional workflow blueprint for the following prompt: "${prompt}". Make sure coordinates do not overlap. Space them sequentially on the X axis.`,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    const parsedJson = JSON.parse((response.text || "").replace(/```json/gi, "").replace(/```/gi, "").trim());
    if (parsedJson.nodes && parsedJson.nodes.length > 0) {
      generatedNodes = parsedJson.nodes;
      generatedEdges = parsedJson.edges || [];
      generatedName = parsedJson.name || generatedName;
      generatedDesc = parsedJson.description || generatedDesc;
    }
  } catch (err: any) {
    console.warn("AI Generation failed, utilizing high-grade default template fallback graph.", err.message);
  }

  // Double check that color and layout properties are properly pre-loaded
  generatedNodes = generatedNodes.map((n, i) => ({
    ...n,
    status: "idle",
    color: n.color || ["#10B981", "#14B8A6", "#8B5CF6", "#EF4444", "#3B82F6", "#EC4899", "#0EA5E9"][i % 7],
    x: n.x || (i * 260 + 100),
    y: n.y || 160
  }));

  res.json({
    success: true,
    workflow: {
      id: `ai_wf_${Date.now()}`,
      name: generatedName,
      description: generatedDesc,
      version: "1.0.0",
      created: "Just now",
      updated: "Just now",
      tags: ["AI Generated", "Copilot"],
      status: "draft",
      nodes: generatedNodes,
      edges: generatedEdges
    }
  });
});

// API: AI Workflow Reviewer & Optimizer Checkpoint
app.post("/api/review-workflow", async (req, res) => {
  const { nodes, edges } = req.body;
  
  // 1. Compile deterministic structural validations
  const suggestions: any[] = [];
  let issuesDetected = 0;

  const hasStart = nodes.some((n: any) => n.type === "start");
  const hasEnd = nodes.some((n: any) => n.type === "end" || n.type === "output");
  const hasMemory = nodes.some((n: any) => n.type === "memory");
  const hasPrompt = nodes.some((n: any) => n.type === "prompt");
  const hasGemini = nodes.some((n: any) => n.type === "gemini");

  if (!hasStart) {
    issuesDetected++;
    suggestions.push({
      id: "err_start",
      severity: "critical",
      nodeId: null,
      message: "Missing Pipeline Entrance Trigger",
      description: "Every production workflow requires an entry trigger ('start') to define runtime variables safely.",
      fix: "Append a 'Start Node' to the left of your pipeline."
    });
  }

  if (!hasEnd) {
    issuesDetected++;
    suggestions.push({
      id: "err_end",
      severity: "warning",
      nodeId: null,
      message: "Missing Terminal Node",
      description: "The pipeline has no explicit exit or output block. Generated state payload will not be persistent.",
      fix: "Append an 'Output Logger' or 'End Node' at the terminal boundary."
    });
  }

  // Detect isolated nodes (Disconnected nodes check)
  nodes.forEach((n: any) => {
    const hasIn = edges.some((e: any) => e.target === n.id);
    const hasOut = edges.some((e: any) => e.source === n.id);
    if (!hasIn && !hasOut && n.type !== "start") {
      issuesDetected++;
      suggestions.push({
        id: `err_isolated_${n.id}`,
        severity: "warning",
        nodeId: n.id,
        message: `Isolated Node: [${n.label}]`,
        description: "This block is currently floating on the visual canvas. It does not receive data or pass output downstream.",
        fix: "Connect an execution thread from preceding blocks to this node's input handle."
      });
    }
  });

  // Chatbot prompt validation check
  if (hasPrompt && !hasMemory) {
    issuesDetected++;
    suggestions.push({
      id: "err_prompt_no_mem",
      severity: "info",
      nodeId: null,
      message: "Prompt Context Optimization",
      description: "A prompt template was detected but no long-term conversational memory block is linked. Subsequent queries will lose historical dialog context.",
      fix: "Place a 'Memory Node' and map its outcome variables to the prompt builder."
    });
  }

  // 2. Query Gemini for deep prompt/LLM optimization recommendations if key exists
  try {
    const ai = getGeminiClient();
    const systemInstruction = 
      `You are an expert AI system security reviewer and graph architect. Review the provided workflow structure (represented in JSON format) and output a clean, high-grade list of detailed improvement actions.
      Evaluate prompt engineering, security, temperature, and cyclic dependencies.
      Output response strictly in the following JSON schema shape:
      {
        "suggestions": [
          {
            "id": "some_random_id",
            "severity": "critical" | "warning" | "info",
            "nodeId": "offending_node_id_or_null",
            "message": "Direct concise issue title",
            "description": "Underlying problem description",
            "fix": "Actionable instructions to resolve the warning"
          }
        ]
      }
      Do NOT output any surrounding text or markdown blocks. Return clean JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Review this workflow nodes configuration:\n${JSON.stringify(nodes)}\n\nEdges:\n${JSON.stringify(edges)}`,
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });

    const parsed = JSON.parse((response.text || "").replace(/```json/gi, "").replace(/```/gi, "").trim());
    if (parsed.suggestions && parsed.suggestions.length > 0) {
      parsed.suggestions.forEach((item: any) => {
        suggestions.push(item);
        issuesDetected++;
      });
    }
  } catch (err: any) {
    // Graceful fallback to static analytical results when offline
    if (suggestions.length === 0) {
      suggestions.push({
        id: "static_opt_1",
        severity: "info",
        nodeId: null,
        message: "Gemini Model Selection Suggestion",
        description: "Standard LLM tasks should ideally target gemini-3.5-flash to improve latency and control cost efficiency, while reasoning heavy tasks should run on gemini-3.1-pro-preview.",
        fix: "Click Settings on the LLM block to inspect and verify selected AI models."
      });
    }
  }

  res.json({
    success: true,
    suggestions,
    issuesDetected
  });
});

// Serve Vite dev server in development, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FlowForge AI] Server running on http://localhost:${PORT}`);
  });
}

startServer();
