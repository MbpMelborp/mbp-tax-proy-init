export type Project = {
  info?: ProjectInfo;
  templates?: Template[];
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
  created_at: string;
  updated_at: string;
  name: string;
  self: string;
  uid: string;
  preview_url: string;
  width: number;
  height: number;
  available_modifications: Modification[];
  metadata: any;
  tags: string[];
};

export type Modification = {
  name: string;
  color?: string | null;
  image_url?: string | null;
  text?: string | null;
  background?: string | null;
};
