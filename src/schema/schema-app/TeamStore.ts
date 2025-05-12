import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { UserModel } from '../schema-models/UserModel';

export const TeamStore = types
  .model('TeamStore', {
    userRole: types.optional(types.enumeration(['admin', 'manager', 'viewer']), 'viewer'),
    members: types.optional(types.array(UserModel), []),
    roles: types.optional(types.map(types.enumeration(['admin', 'manager', 'viewer'])), {}),
  })
  .actions((self) => ({
    setUserRole(role: 'admin' | 'manager' | 'viewer') {
      self.userRole = role;
    },
    addMember(user: Instance<typeof UserModel>) {
      self.members.push(user);
      self.roles.set(String(user.id), 'viewer');
    },
    removeMember(userId: number) {
      self.members.replace(self.members.filter(m => m.id !== userId));
      self.roles.delete(String(userId));
    },
    setMemberRole(userId: number, role: 'admin' | 'manager' | 'viewer') {
      self.roles.set(String(userId), role);
    },
  }))
  .views((self) => ({
    getMemberRole(userId: number) {
      return self.roles.get(String(userId)) || 'viewer';
    },
    hasPermission(permission: 'edit' | 'view' | 'manage') {
      if (self.userRole === 'admin') return true;
      if (self.userRole === 'manager') return permission !== 'manage';
      if (self.userRole === 'viewer') return permission === 'view';
      return false;
    },
  }));

export interface ITeamStore extends Instance<typeof TeamStore> {}
export interface ITeamStoreSnapshotIn extends SnapshotIn<typeof TeamStore> {}
export interface ITeamStoreSnapshotOut extends SnapshotOut<typeof TeamStore> {} 