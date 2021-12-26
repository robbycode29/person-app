import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-masini-modal',
  templateUrl: './masini-modal.component.html',
})
export class MasiniModalComponent implements OnInit {
  @Input() id_masina: number | undefined;

  modal = {} as any;

  masiniForm: FormGroup | any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.masiniForm = this.fb.group({
      marca: ['', [Validators.required]],
      model: ['', [Validators.required]],
      an_fabricatie: ['',[Validators.required]],
      cap_cilindrica: ['',[Validators.required]],
      tx_imp: '' 
    })
    const cap_cilindrica = this.masiniForm.get('cap_cilindrica')
    const tx_imp = this.masiniForm.get('tx_imp')
    cap_cilindrica.valueChanges.subscribe((value: number) => {
      let tax = this.calcTaxes(value)
      tx_imp.setValue(tax)
    })

    if (this.id_masina) {
      this._spinner.show();
      axios.get(`/api/masini/${this.id_masina}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informației!'));
    }
  }

  get marca() {
    return this.masiniForm.get('marca')
  }
  get model() {
    return this.masiniForm.get('model')
  }
  get an_fabricatie() {
    return this.masiniForm.get('an_fabricatie')
  }
  get cap_cilindrica() {
    return this.masiniForm.get('cap_cilindrica')
  }
  get tx_imp() {
    return this.masiniForm.get('tx_imp')
  }

  calcTaxes(cap: number) {
    let tax
    if(cap <= 1500) tax = 50
    else if(cap > 1500 && cap <= 2000) tax = 100
    else if(cap > 2000) tax = 200
    return tax 
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
