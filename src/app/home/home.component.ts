import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {RepairCase} from '../model/RepairCase';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CaseWorker} from '../model/CaseWorker';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {LoginUserService} from '../login-user/login-user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private httpClient: HttpClient, private loginService: LoginUserService) {

    this.filteredWorkers = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.workers.slice())
      );

  }

  private registerCaseObservable: Observable<RepairCase[]>;
  private workers: CaseWorker[];
  caseToRegister: RepairCase = new RepairCase();
  stateCtrl = new FormControl();
  filteredWorkers: Observable<CaseWorker[]>;

  ngOnInit() {
    this.getAllCases();
    this.getAllWorkers();
  }


  getAllCases(): void {
    this.registerCaseObservable = this.httpClient.get<RepairCase[]>('http://localhost:5000/api/repaircase');
  }

  getAllWorkers(): void {
    this.httpClient.get<CaseWorker[]>('http://localhost:5000/api/worker').subscribe(resp => {
      this.workers = resp;
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

  private _filterStates(value: string): CaseWorker[] {
    const filterValue = value.toLowerCase();

    return this.workers.filter(worker => worker.name.toLowerCase().indexOf(filterValue) === 0);
  }

  assignWorker(repairCase: RepairCase, workerId: number) {
    repairCase.worker = new CaseWorker();
    repairCase.worker.id = workerId;

    this.httpClient.put<RepairCase>('http://localhost:5000/api/repaircase', repairCase).subscribe(resp => {
      console.log(resp);
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
    this.httpClient.put<RepairCase>('http://localhost:5000/api/repaircase', repairCase).subscribe( resp => {
      this.getAllCases();
    });
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
