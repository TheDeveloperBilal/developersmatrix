// Types for AI Website Audit Tool

export interface AuditConfig {
  url: string;
  maxPages?: number;
  timeout?: number;
  userAgent?: string;
  followRedirects?: boolean;
}

export interface PageData {
  url: string;
  title: string;
  html: string;
  text: string;
  headers: Record<string, string>;
  statusCode: number;
  loadTime: number;
  size: number;
  links: LinkInfo[];
  images: ImageInfo[];
  scripts: ScriptInfo[];
  styles: StyleInfo[];
  meta: MetaInfo;
  structured_data: StructuredData[];
  forms: FormInfo[];
}

export interface LinkInfo {
  href: string;
  text: string;
  rel?: string;
  target?: string;
  isInternal: boolean;
  isBroken?: boolean;
  statusCode?: number;
}

export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: string;
  size?: number;
}

export interface ScriptInfo {
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  content?: string;
  size?: number;
}

export interface StyleInfo {
  href?: string;
  content?: string;
  size?: number;
}

export interface MetaInfo {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  viewport?: string;
  charset?: string;
  lang?: string;
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
}

export interface StructuredData {
  type: string;
  json: Record<string, unknown>;
}

export interface FormInfo {
  action?: string;
  method?: string;
  inputs: FormInput[];
  hasLabel: boolean;
}

export interface FormInput {
  type: string;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  hasLabel: boolean;
}

export interface AuditIssue {
  id: string;
  category: AuditCategory;
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  impact: string;
  suggestion: string;
  url?: string;
  element?: string;
  priority: number;
}

export type AuditCategory = 
  | 'seo'
  | 'performance'
  | 'mobile'
  | 'security'
  | 'accessibility'
  | 'content'
  | 'conversion';

export type IssueType = 
  | 'missing_title'
  | 'duplicate_title'
  | 'missing_meta_description'
  | 'duplicate_meta_description'
  | 'missing_h1'
  | 'multiple_h1'
  | 'missing_alt_text'
  | 'broken_link'
  | 'slow_load_time'
  | 'large_page_size'
  | 'missing_https'
  | 'missing_viewport'
  | 'missing_canonical'
  | 'missing_schema'
  | 'missing_og_tags'
  | 'text_too_small'
  | 'touch_target_small'
  | 'missing_security_header'
  | 'mixed_content'
  | 'missing_label'
  | 'low_contrast'
  | 'heading_hierarchy'
  | 'thin_content'
  | 'keyword_stuffing'
  | 'missing_cta'
  | 'weak_value_proposition'
  | 'generic_content'
  | 'missing_trust_signals'
  | 'missing_social_proof'
  | 'large_image'
  | 'render_blocking'
  | 'missing_lazy_loading'
  | 'missing_compression'
  | 'duplicate_content'
  | 'url_structure'
  | 'internal_linking'
  | 'redirect_chain'
  | 'missing_sitemap'
  | 'missing_robots_txt';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface AuditScore {
  category: AuditCategory;
  score: number;
  maxScore: number;
  issues: number;
  criticalIssues: number;
  passed: number;
  failed: number;
}

export interface ContentAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  avgParagraphLength: number;
  readabilityScore: number;
  readabilityGrade: string;
  vocabularyDiversity: number;
  keywordDensity: Record<string, number>;
  repeatedPhrases: string[];
  passiveVoice: number;
  activeVoice: number;
  sentimentScore: number;
  hasCTA: boolean;
  ctaCount: number;
  trustSignals: string[];
  valueProposition: string | null;
  readingTime: number;
}

export interface WebsiteAuditResult {
  url: string;
  domain: string;
  scannedAt: string;
  scanDuration: number;
  pagesScanned: number;
  
  overallScore: number;
  
  scores: {
    seo: AuditScore;
    performance: AuditScore;
    mobile: AuditScore;
    security: AuditScore;
    accessibility: AuditScore;
    content: AuditScore;
    conversion: AuditScore;
  };
  
  issues: AuditIssue[];
  
  recommendations: string[];
  
  pageData: PageData[];
  
  contentAnalysis: ContentAnalysis;
  
  quickWins: AuditIssue[];
  
  criticalIssues: AuditIssue[];
  
  summary: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
}

export interface CrawlProgress {
  status: 'idle' | 'initializing' | 'crawling' | 'analyzing' | 'scoring' | 'complete' | 'error';
  message: string;
  progress: number;
  pagesScanned: number;
  totalPages: number;
  currentPage?: string;
  errors: string[];
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  domain: string;
  overallScore: number;
  scannedAt: string;
  issueCount: number;
  criticalCount: number;
}

export interface AuditComparison {
  previous: AuditHistoryItem;
  current: WebsiteAuditResult;
  scoreChange: number;
  improvements: AuditIssue[];
  regressions: AuditIssue[];
  resolvedIssues: AuditIssue[];
  newIssues: AuditIssue[];
}
