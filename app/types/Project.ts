export type Project = {
  info?: ProjectInfo;
  templates?: Template[];
  images?: string[];
};

export type ProjectInfo = {
  name: string;
  created_at: string;
  uid: string;
  image_proxy: boolean;
  web_sessions: boolean;
  templates: number;
};
export type Template = {
  created_at?: string;
  updated_at?: string;
  name?: string;
  self?: string;
  uid?: string;
  preview_url?: string;
  width?: number;
  height: number;
  available_modifications?: Modification[];
  metadata?: any;
  tags?: string[] | null;
};

export type Modification = {
  name: string;
  color?: string | null;
  image_url?: string | null;
  text?: string | null;
  background?: string | null;
};

export type ImageBB = {
  created_at?: string;
  status?: string;
  self?: string;
  uid?: string;
  image_url?: string;
  image_url_png?: string;
  image_url_jpg?: string;
  template?: string;
  template_version?: string | null;
  modifications?: Modification[];
  webhook_url?: string | null;
  webhook_response_code?: string | null;
  transparent?: boolean;
  metadata?: any;
  template_name?: string;
  width?: number;
  height?: number;
  render_pdf?: boolean;
  pdf_url?: string | null;
  pdf_url_compressed?: string | null;
  open?: boolean;
};
