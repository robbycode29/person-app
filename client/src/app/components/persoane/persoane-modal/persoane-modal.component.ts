import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';

@Component({
  selector: 'app-persoane-modal',
  templateUrl: './persoane-modal.component.html',
})
export class PersoaneModalComponent implements OnInit {
  @Input() id_persoana: number | undefined;
  @Input() cars: [] | any;
  
  selected: any = [];
  allcars: any = [];
  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.id_persoana) {
      this._spinner.show();
      axios.get(`/api/persoane/${this.id_persoana}`).then(({ data }) => {
        this.modal = data;
        console.log(this.id_persoana, data)
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informației!'));
    }
    axios.get('/api/masini').then(({ data }) => {
      this.allcars = data;
    }).catch(() => toastr.error('Eroare la preluarea masinilor'))

    this.addSelected(this.cars);
  }

  addSelected(arr: []) {
    arr.forEach((element: { marca: string, model: string, an_fabricatie: string }) => {
      this.selected.push(`${element.marca} ${element.model} ${element.an_fabricatie}`)    
    });
  }

  save(): void {
    this._spinner.show();

    if (!this.id_persoana) {
      axios.post('/api/persoane', this.modal).then(() => {
        this._spinner.hide();
        toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/persoane', this.modal).then(() => {
        this._spinner.hide();
        toastr.success('Informația a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => toastr.error('Eroare la modificarea informației!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }

}
