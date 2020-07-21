import { BaseEntity } from 'src/model/base-entity';
import { Profile } from '../profile/profile.model';

export class File implements BaseEntity {
  constructor(public id?: number, public name?: string, public fileContentType?: string, public file?: any, public user?: Profile) {}
}
