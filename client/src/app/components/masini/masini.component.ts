import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { MasiniModalComponent } from './masini-modal/masini-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
})
export class MasiniComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  masini: any = [];
  sresults = this.masini

  masiniTable: FormGroup | any;

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private fb: FormBuilder) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
    this.masiniTable = this.fb.group({
      smarca: '',
      smodel: '',
      san_fab: '',
      scap_cil: '',
      stx_imp: ''
    })
    const smarca = this.masiniTable.get('smarca')
    const smodel = this.masiniTable.get('smodel')
    const san_fab = this.masiniTable.get('san_fab')
    const scap_cil = this.masiniTable.get('scap_cil')
    const stx_imp = this.masiniTable.get('stx_imp')

    this.searchListByMarca(smarca)
    this.searchListByModel(smodel)
    this.searchListByAn(san_fab)
    this.searchListByCap(scap_cil)
    this.searchListByTax(stx_imp)
  }

  
  searchListByMarca(searchString: any) {
    searchString.valueChanges.subscribe((value: string) => {
      this.sresults = this.masini.filter((masina: Object | any) => masina.marca.includes(value))
    })
  }
  searchListByModel(searchString: any) {
    searchString.valueChanges.subscribe((value: string) => {
      this.sresults = this.masini.filter((masina: Object | any) => masina.model.includes(value))
    })
  }
  searchListByAn(searchString: any) {
    searchString.valueChanges.subscribe((value: number) => {
      this.sresults = this.masini.filter((masina: Object | any) => masina.an_fabricatie.toString().includes(value))
    })
  }
  searchListByCap(searchString: any) {
    searchString.valueChanges.subscribe((value: number) => {
      this.sresults = this.masini.filter((masina: Object | any) => masina.cap_cilindrica.toString().includes(value))
    })
  }
  searchListByTax(searchString: any) {
    searchString.valueChanges.subscribe((value: number) => {
      this.sresults = this.masini.filter((masina: Object | any) => masina.tx_imp.toString().includes(value))
    })
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/masini').then(({ data }) => {
      this.masini = data;
      this._spinner.hide();
    }).catch(() => toastr.error('Eroare la preluarea informațiilor!'));
  }

  addEdit = (id_masina?: number): void => {
    const modalRef = this._modal.open(MasiniModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_masina = id_masina;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (masina: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți masina având marca <b>${masina.marca}</b>, modelul: <b>${masina.modelul}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/masini/${masina.id}`).then(() => {
        toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => toastr.error('Eroare la ștergerea informației!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
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
