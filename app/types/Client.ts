export interface Client {
  name?: string;
  id?: string;
  projects: Array<ProjectC>;
}

export interface ProjectC {
  api: string;
  uid: string;
  name: string;
}
