import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersoaneModalComponent } from './persoane-modal/persoane-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';
import { FormBuilder, FormGroup } from '@angular/forms';


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
  sresults = this.carowners;

  persoaneTable: FormGroup | any;

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private fb: FormBuilder) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
    this.persoaneTable = this.fb.group({
      snume: '',
      sprenume: '',
      scnp: '',
      svarsta: ''
    })
    const snume = this.persoaneTable.get('snume')
    const sprenume = this.persoaneTable.get('sprenume')
    const scnp = this.persoaneTable.get('scnp')
    const svarsta = this.persoaneTable.get('svarsta')

    this.searchListByNume(snume)
    this.searchListByPrenume(sprenume)
    this.searchListByCNP(scnp)
    this.searchListByVarsta(svarsta)
  }

  searchListByNume(searchString: any) {
    searchString.valueChanges.subscribe((value: string) => {
      this.sresults = this.carowners.filter((carowner: Object | any) => carowner.nume.includes(value) || carowner.nume.toLowerCase().includes(value))
    })
  }
  searchListByPrenume(searchString: any) {
    searchString.valueChanges.subscribe((value: string) => {
      this.sresults = this.carowners.filter((carowner: Object | any) => carowner.prenume.includes(value) || carowner.prenume.toLowerCase().includes(value))
    })
  }
  searchListByCNP(searchString: any) {
    searchString.valueChanges.subscribe((value: string) => {
      this.sresults = this.carowners.filter((carowner: Object | any) => carowner.cnp.includes(value))
    })
  }
  searchListByVarsta(searchString: any) {
    searchString.valueChanges.subscribe((value: number) => {
      this.sresults = this.carowners.filter((carowner: Object | any) => carowner.varsta.toString().includes(value))
    })
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/persoane').then(({ data }) => {
      this.persoane = data;
      axios.get('/api/persoane/cars').then(({data}) => {
        this.junctions = data;
        this.makeCarOwners(this.persoane, this.junctions);
      })
      this._spinner.hide();
    }).catch(() => toastr.error('Eroare la preluarea informațiilor!'));
  }

  makeCarOwners(persoane: { id: number; nume: string; prenume: string; cnp: string; varsta: number; }[], junctions: { id_person: number; id_car: number; id: number; marca: string; model: string; an_fabricatie: number; cap_cilindrica: number; tx_imp: number; }[]): void {
    persoane.forEach((persoana: { id: number; nume: string; prenume: string; cnp: string; varsta: number; }) => {
      this.carowners[this.persoane.indexOf(persoana)] = {
        id: persoana.id,
        nume: persoana.nume,
        prenume: persoana.prenume,
        cnp: persoana.cnp,
        varsta: persoana.varsta,
        carsOwned: []
      }   
    });
    junctions.forEach((car: { id_person: number; id_car: number; id: number, marca: string; model: string; an_fabricatie: number; cap_cilindrica: number; tx_imp: number; }) => {  
      this.carowners.forEach((carowner: { carsOwned: any[]; id: number; }) => {
        if(carowner.id === car.id_person) {
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


