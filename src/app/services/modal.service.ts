import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalData } from '../models/modal-data';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalDataSource = new Subject<ModalData>();
  modalData$ = this.modalDataSource.asObservable();

  private modalStateSource = new Subject<boolean>();
  modalState$ = this.modalStateSource.asObservable();

  openModal(message: string): void {
    this.modalDataSource.next({ message });
    this.modalStateSource.next(true);
  }

  closeModal(): void {
    this.modalStateSource.next(false);
  }
}
