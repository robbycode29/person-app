import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersoaneModalComponent } from './persoane-modal/persoane-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';


@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
})
export class PersoaneComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persoane: any = [];
  junctions: any = [];
  carowners: any = [];

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/persoane').then(({ data }) => {
      this.makeUniqueEntries(data);
      this.makeCarOwners();
      this._spinner.hide();
    }).catch(() => toastr.error('Eroare la preluarea informațiilor!'));
  }

  makeUniqueEntries(data: any = []) {
    this.junctions = data;
      for(let i = 0; i <= data.length-1; i++) {
        if(data[i-1] === undefined) this.persoane.push(data[i])
        else if(data[i].id_person === data[i-1].id_person) continue
        else this.persoane.push(data[i])
      }
  }

  makeCarOwners(): void {
    this.persoane.forEach((persoana: { id: number; id_person: number; nume: string; prenume: string; cnp: string; varsta:number; }) => {
      this.carowners[this.persoane.indexOf(persoana)] = {
        id: persoana.id_person,
        nume: persoana.nume,
        prenume: persoana.prenume,
        cnp: persoana.cnp,
        varsta: persoana.varsta,
        carsOwned: []
      }
           
    });
    this.junctions.forEach((car: { id: number; id_car: number; marca: string; model: string; an_fabricatie: number; cap_cilindrica: number; tx_imp: number; }) => {
      this.carowners.forEach((carowner: { carsOwned: any[]; id: number; }) => {
        if(carowner.id === car.id) {
          carowner.carsOwned.push({
            id_car: car.id_car,
            marca: car.marca,
            model: car.model,
            an_fabricatie: car.an_fabricatie,
            cap_cilindrica: car.cap_cilindrica,
            tx_imp: car.tx_imp
          });
        }
        else return
      });
    });

  }

  addEdit = (id_persoana?: number, id?: number): void => {
    const modalRef = this._modal.open(PersoaneModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_persoana = id_persoana;
    modalRef.componentInstance.cars = (id_persoana && id===0 || id) ? this.carowners[id].carsOwned: null;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (persoana: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere persoana`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana având CNP <b>${persoana.cnp}</b>, numele: <b>${persoana.nume} ${persoana.prenume}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/persoane/${persoana.id}`).then(() => {
        toastr.success('Persoana a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => toastr.error('Eroare la ștergerea informației!'));
    });
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-informations', 0);
    this.limit = 70;
  }
}


