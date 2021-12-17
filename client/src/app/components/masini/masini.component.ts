import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { MasiniModalComponent } from './masini-modal/masini-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { toastr } from '../toastr/toastr.component';


@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss']
})
export class MasiniComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  informations: any = [];

  constructor() { }

  ngOnInit(): void {
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
