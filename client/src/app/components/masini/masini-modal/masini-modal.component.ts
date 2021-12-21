import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';

@Component({
  selector: 'app-masini-modal',
  templateUrl: './masini-modal.component.html',
  styleUrls: ['./masini-modal.component.scss']
})
export class MasiniModalComponent implements OnInit {
  @Input() id_masina: number | undefined;

  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.id_masina) {
      this._spinner.show();
      axios.get(`/api/masini/${this.id_masina}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informației!'));
    }
  }

  save(): void {
    this._spinner.show();

    if (!this.id_masina) {
      axios.post('/api/masini', this.modal).then(() => {
        this._spinner.hide();
        toastr.success('Informația a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => toastr.error('Eroare la salvarea informației!'));
    } else {
      axios.put('/api/masini', this.modal).then(() => {
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
