export type NodeType =
  | 'start'
  | 'end'
  | 'prompt'
  | 'gemini'
  | 'memory'
  | 'knowledge_base'
  | 'retriever'
  | 'tool'
  | 'api'
  | 'database'
  | 'condition'
  | 'loop'
  | 'function'
  | 'http_request'
  | 'email'
  | 'webhook'
  | 'vector_search'
  | 'human_approval'
  | 'output'
  | 'custom';

export interface NodeConfig {
  // Prompt Node
  promptTemplate?: string;
  variables?: { name: string; value: string }[];
  temperature?: number;
  model?: string;
  systemPrompt?: string;
  outputFormat?: 'text' | 'json' | 'markdown';
  
  // Gemini Node
  geminiModel?: string;
  geminiTemperature?: number;
  geminiMaxTokens?: number;
  
  // Memory Node
  memoryType?: 'conversation' | 'long_term' | 'vector' | 'short_term';
  memoryKey?: string;
  knowledgeSource?: string;
  
  // Retriever Node
  topK?: number;
  embeddingSearch?: boolean;
  chunkSize?: number;
  similarityThreshold?: number;
  
  // Tool Node
  toolName?: string;
  authType?: 'none' | 'api_key' | 'oauth2' | 'bearer';
  apiKeySecretName?: string;
  parameters?: { name: string; type: string; description: string; value: string }[];
  retries?: number;
  timeout?: number;

  // Custom code or functions
  customCode?: string;

  // HTTP / Webhook / API / Email
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: { key: string; value: string }[];
  body?: string;
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;

  // Condition
  conditionField?: string;
  conditionOperator?: 'equals' | 'contains' | 'gt' | 'lt' | 'exists';
  conditionValue?: string;

  // Beginner-friendly integrations (Gemini, ChatGPT, Google Docs, Sheets, Calendar, Gmail, YouTube, Instagram, WhatsApp, Other Services)
  serviceProvider?: 'gemini' | 'openai' | 'anthropic' | 'gmail' | 'gdocs' | 'gsheets' | 'gcal' | 'custom_api' | 'youtube' | 'instagram' | 'whatsapp' | 'other_services';
  serviceAction?: string;
  apiKey?: string;
  userEmail?: string;
  serviceAuthType?: 'api_key' | 'google_oauth' | 'none';
  googleDocId?: string;
  googleDocContent?: string;
  googleSheetId?: string;
  googleSheetAction?: 'append' | 'read' | 'clear';
  googleSheetRowData?: string;
  googleCalendarId?: string;
  gcalEventTitle?: string;
  gcalStartTime?: string;
  gcalDescription?: string;
  dynamicVariables?: { key: string; sourceNodeId: string; sourceField: string }[];

  // YouTube Integrations
  youtubeAction?: 'get_video_details' | 'search_videos' | 'get_comments' | 'publish_comment';
  youtubeVideoUrl?: string;
  youtubeSearchQuery?: string;

  // Instagram Integrations
  instagramAction?: 'publish_photo' | 'publish_reel' | 'get_user_profile' | 'get_media_analytics';
  instagramMediaUrl?: string;
  instagramCaption?: string;

  // WhatsApp Integrations
  whatsappAction?: 'send_template_message' | 'send_text_message' | 'send_media_message';
  whatsappPhoneNumber?: string;
  whatsappMessageText?: string;

  // Other n8n / Zapier compatible service integrations
  otherServiceName?: string;
  otherServiceAction?: string;
  otherServiceFields?: { name: string; type: 'string' | 'textarea' | 'boolean'; placeholder: string; value: string }[];
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  config: NodeConfig;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'waiting';
  executionTime?: number;
  output?: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  created: string;
  updated: string;
  tags: string[];
  status: 'draft' | 'active' | 'paused';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  nodeType: NodeType;
  status: 'running' | 'completed' | 'failed' | 'waiting';
  duration: number; // ms
  tokens?: number;
  output?: string;
  error?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface Stats {
  totalWorkflows: number;
  totalExecutions: number;
  successRate: number; // percentage
  avgRuntime: number; // ms
  tokenUsage: number;
  estimatedCost: number; // USD
  mostUsedNode: string;
}
