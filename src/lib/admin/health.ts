export type AdminCapabilities = {
  blobConfigured: boolean;
  githubConfigured: boolean;
};

export function getAdminCapabilities(): AdminCapabilities {
  return {
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    githubConfigured: Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO),
  };
}
