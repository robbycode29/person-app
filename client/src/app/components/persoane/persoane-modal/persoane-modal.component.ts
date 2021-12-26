import axios from 'axios';
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { toastr } from '../../toastr/toastr.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

  persoaneForm: FormGroup | any;
  currentDate = new Date();
  date: Date | any;

  constructor(
    private _spinner: NgxSpinnerService, 
    public activeModal: NgbActiveModal, 
    private fb: FormBuilder, 
    private datePipe: DatePipe) { 
      this.date = this.datePipe.transform(this.currentDate, 'YYYY')
    }

  ngOnInit(): void {
    this.persoaneForm = this.fb.group({
      nume: ['', [Validators.required]],
      prenume: ['', [Validators.required]],
      cnp: ['',[Validators.required]],
      varsta: '',
      cars: [] 
    })
    const cnp = this.persoaneForm.get('cnp')
    const varsta = this.persoaneForm.get('varsta')
    cnp.valueChanges.subscribe((value: string) => {
      let age = this.calcAge(value, this.date)
      varsta.setValue(age)
    })
    if (this.id_persoana) {
      this._spinner.show();
      axios.get(`/api/persoane/${this.id_persoana}`).then(({ data }) => {
        this.modal = data;
        console.log(this.id_persoana, data) //first arg: request made for person with id id_persoana, second arg: data returned
        this._spinner.hide();
      }).catch(() => toastr.error('Eroare la preluarea informației!'));
    }
    axios.get('/api/masini').then(({ data }) => {
      this.allcars = data;
    }).catch(() => toastr.error('Eroare la preluarea masinilor'))

    this.addSelected(this.cars);
  }

  get nume() {
    return this.persoaneForm.get('nume')
  }
  get prenume() {
    return this.persoaneForm.get('prenume')
  }
  get cnp() {
    return this.persoaneForm.get('cnp')
  }
  get varsta() {
    return this.persoaneForm.get('varsta')
  }

  calcAge(cnp: string, year: number) {
    let ageIndex = parseInt(cnp[1] + cnp[2])
    let age
    if(ageIndex === 0) age = year - 2000
    else if(ageIndex <= 99 && parseInt(cnp[0]) === 1 || parseInt(cnp[0]) === 2) age = year - 1900 - ageIndex
    else if(ageIndex >= 1 && ageIndex <= 21 && (parseInt(cnp[0]) === 5 || parseInt(cnp[0]) === 6)) age = year - 2000 - ageIndex
    else if(ageIndex > 21 && (parseInt(cnp[0]) === 5 || parseInt(cnp[0]) === 6)) return 'CNP INCORECT'
    else return 'CNP INCORECT'
    return age
  }

  addSelected(arr?: []) {
    if(arr) arr.forEach((element: { marca: string, model: string, an_fabricatie: string }) => {
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
