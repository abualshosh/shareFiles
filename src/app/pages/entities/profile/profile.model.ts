import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';
import { File } from '../file/file.model';

export class Profile implements BaseEntity {
  constructor(public id?: number, public phoneNumber?: string, public user?: User, public files?: File[]) {}
}
