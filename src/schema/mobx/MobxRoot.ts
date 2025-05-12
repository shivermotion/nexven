import { types, Instance, SnapshotIn, SnapshotOut, flow, getSnapshot, applySnapshot } from 'mobx-state-tree';
import { TeamStore } from '../schema-app/TeamStore';
import { AuditLogStore } from '../schema-app/AuditLogStore';
import { UserStore } from '../schema-app/UserStore';

export const MSTRoot = types
  .model({
    TeamStore: types.optional(TeamStore, {}),
    AuditLogStore: types.optional(AuditLogStore, {}),
    UserStore: types.optional(UserStore, {}),
    isAuthenticated: types.optional(types.boolean, false),
    isOnboarded: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    logout: flow(function* () {
      self.isAuthenticated = false;
      applySnapshot(self, {});
    }),
    updateOnboardStatus: flow(function* (status: boolean) {
      self.isOnboarded = status;
    }),
    logRootStore() {
      console.log(getSnapshot(self));
    },
  }))
  .create({});

export interface IRootStore extends Instance<typeof MSTRoot> {
  TeamStore: Instance<typeof TeamStore>;
  AuditLogStore: Instance<typeof AuditLogStore>;
  UserStore: Instance<typeof UserStore>;
}
export interface IRootStoreSnapshotIn extends SnapshotIn<typeof MSTRoot> {}
export interface IRootStoreSnapshotOut extends SnapshotOut<typeof MSTRoot> {} 