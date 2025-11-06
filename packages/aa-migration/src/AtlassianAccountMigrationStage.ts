export const AtlassianAccountMigrationStage = {
  done: 'done',
  newlyManaged: 'newlyManaged',
  enterpriseMigration: 'enterpriseMigration',
  inactiveMigration: 'inactiveMigration',
  confirmEmail: 'confirmEmail',
} as const;
export type AtlassianAccountMigrationStageType =
  (typeof AtlassianAccountMigrationStage)[keyof typeof AtlassianAccountMigrationStage];
