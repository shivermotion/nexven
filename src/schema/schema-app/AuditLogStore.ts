import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';

const AuditLogEntry = types.model('AuditLogEntry', {
  timestamp: types.number,
  user: types.string,
  action: types.string,
  details: types.maybe(types.string),
});

export const AuditLogStore = types
  .model('AuditLogStore', {
    logs: types.optional(types.array(AuditLogEntry), []),
  })
  .actions((self) => ({
    addLog(entry: Omit<Instance<typeof AuditLogEntry>, 'timestamp'>) {
      self.logs.unshift({ ...entry, timestamp: Date.now() });
    },
  }));

export interface IAuditLogStore extends Instance<typeof AuditLogStore> {}
export interface IAuditLogStoreSnapshotIn extends SnapshotIn<typeof AuditLogStore> {}
export interface IAuditLogStoreSnapshotOut extends SnapshotOut<typeof AuditLogStore> {} 