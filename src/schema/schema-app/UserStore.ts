import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { UserModel } from '../schema-models/UserModel';

export const UserStore = types
  .model('UserStore', {
    user: types.maybe(UserModel),
  })
  .actions((self) => ({
    setUser(user: Instance<typeof UserModel>) {
      self.user = user;
    },
  }));

export interface IUserStore extends Instance<typeof UserStore> {}
export interface IUserStoreSnapshotIn extends SnapshotIn<typeof UserStore> {}
export interface IUserStoreSnapshotOut extends SnapshotOut<typeof UserStore> {} 