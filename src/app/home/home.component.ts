import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {RepairCase} from '../model/RepairCase';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CaseWorker} from '../model/CaseWorker';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {LoginUserService} from '../login-user/login-user.service';
import {RegisterUserComponent} from '../register-user/register-user.component';
import {CaseEquipment} from '../model/CaseEquipment';
import {Owner} from '../model/Owner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private httpClient: HttpClient,
              private loginService: LoginUserService) {

    this.filteredWorkers = this.workerControl.valueChanges
      .pipe(
        startWith(''),
        map(worker => worker ? this._filterWorkers(worker) : this.workers.slice())
      );

    this.filteredEq = this.eqControl.valueChanges
      .pipe(
        startWith(''),
        map(eq => eq ? this._filterEq(eq) : this.equipment.slice())
      );

  }

  private registerCaseObservable: Observable<RepairCase[]>;
  private workers: CaseWorker[];
  private equipment: CaseEquipment[];
  caseToRegister: RepairCase = new RepairCase();
  equipmentToRegister: CaseEquipment = new CaseEquipment();
  workerControl = new FormControl();
  eqControl = new FormControl();
  filteredWorkers: Observable<CaseWorker[]>;
  filteredEq: Observable<CaseEquipment[]>;

  ngOnInit() {
    this.getAllCases();
    this.getAllWorkers();
    this.getAllEquipments();
  }


  getAllCases(): void {
    this.registerCaseObservable = this.httpClient.get<RepairCase[]>('http://localhost:5000/api/repaircase');
  }

  getAllWorkers(): void {
    this.httpClient.get<CaseWorker[]>('http://localhost:5000/api/worker').subscribe(resp => {
      this.workers = resp;
    });
  }

  getAllEquipments(): void {
    this.httpClient.get<CaseEquipment[]>('http://localhost:5000/api/equipment').subscribe(resp => {
      this.equipment = resp;
    });
  }


  openCaseDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '450px',
      data: {caseToRegister: this.caseToRegister}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllCases();

    });
  }

  openAddEquipmentDialog(): void {
    const dialogRef = this.dialog.open(EquipmentDialog, {
      width: '650px',
      data: {equipmentToRegister: this.equipmentToRegister}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  private _filterWorkers(value: string): CaseWorker[] {
    const filterValue = value.toLowerCase();

    return this.workers.filter(worker => worker.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterEq(value: string): CaseEquipment[] {
    const filterValue = value.toLowerCase();

    return this.equipment.filter(eq => eq.model.toLowerCase().indexOf(filterValue) === 0);
  }


  assignWorker(repairCase: RepairCase, workerId: number) {
    repairCase.worker = new CaseWorker();
    repairCase.worker.id = workerId;

    this.httpClient.put<RepairCase>('http://localhost:5000/api/repaircase', repairCase).subscribe(resp => {
      console.log(resp);
      this.getAllCases();
    });

  }

  assignEq(repairCase: RepairCase, eqId: number) {
    repairCase.equipment = new CaseEquipment();
    repairCase.equipment.id = eqId;

    this.httpClient.put<RepairCase>('http://localhost:5000/api/repaircase', repairCase).subscribe(resp => {
      console.log(resp);
      this.getAllCases();
    });

  }

  checkStatus(repairCase: RepairCase): string {
    if (repairCase.status === 'NEW') {
      return 'IN_PROGRESS';
    } else if (repairCase.status === 'IN_PROGRESS') {
      return 'DONE';
    } else if (repairCase.status === 'DONE') {
      return 'READY_TO_PICK';
    } else if (repairCase.status === 'READY_TO_PICK') {
      return 'CLOSED';
    }
  }

  updateRepairCase(repairCase: RepairCase) {
    repairCase.status = this.checkStatus(repairCase);
    this.httpClient.put<RepairCase>('http://localhost:5000/api/repaircase', repairCase).subscribe(resp => {
      this.getAllCases();
    });
  }

  addWorker(repairCase: RepairCase): void {
    repairCase.addWorker = true;
  }


}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./home.component.css']
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public caseToRegister: RepairCase,
    private http: HttpClient) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registerCase() {
    this.http.post('http://localhost:5000/api/repaircase', this.caseToRegister).subscribe(resp => {
      console.log(resp);
    });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'equipment-dialog',
  templateUrl: 'equipment-dialog.html',
  styleUrls: ['./home.component.css']
})
export class EquipmentDialog implements OnInit {

  equipmentForm: FormGroup;
  isOwnerNeeded = false;
  equipmentToRegister: CaseEquipment = new CaseEquipment();

  constructor(
    public dialogRef: MatDialogRef<EquipmentDialog>,
    private http: HttpClient, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.equipmentForm = this.formBuilder.group({
      eqMark: [''],
      eqModel: [''],
      eqType: [''],
      owner: this.formBuilder.group({
        eqOwnerName: [''],
        eqOwnerLastName: [''],
        eqOwnerPhoneNumber: ['']
      })
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addOwner() {
    this.equipmentForm.get('owner.eqOwnerName').setValidators([Validators.required]);
    this.equipmentForm.get('owner.eqOwnerLastName').setValidators([Validators.required]);
    this.equipmentForm.get('owner.eqOwnerPhoneNumber').setValidators([Validators.required, Validators.pattern('^([+]?[\\s0-9]+)?(\\d{3}|[(]?[0-9]+[)])?([-]?[\\s]?[0-9])+$')]);
    this.equipmentToRegister.owner = new Owner();
    this.isOwnerNeeded = true;
  }

  addEquipment() {
    this.http.post<CaseEquipment>('http://localhost:5000/api/equipment', this.equipmentToRegister).subscribe(resp => {
      console.log(resp);
    });
    this.dialogRef.close();
  }

}
