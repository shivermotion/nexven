import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';

export const UserModel = types.model('UserModel', {
  id: types.identifierNumber,
  email: types.optional(types.string, ''),
  firstName: types.optional(types.string, ''),
  lastName: types.optional(types.string, ''),
});

export interface IUserModel extends Instance<typeof UserModel> {}
export interface IUserModelSnapshotIn extends SnapshotIn<typeof UserModel> {}
export interface IUserModelSnapshotOut extends SnapshotOut<typeof UserModel> {} 