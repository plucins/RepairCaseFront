import {CaseWorker} from './CaseWorker';
import {CaseEquipment} from './CaseEquipment';

export class  RepairCase {
  id: number;
  title: string;
  description: string;
  status: string;
  worker: CaseWorker;
  registrationTime: string;
  lastUpdate: string;
  equipment: CaseEquipment;
  addWorker = false;
  addEquipment = false;
}
