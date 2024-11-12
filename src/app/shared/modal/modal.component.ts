import { Component, OnInit, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  private readonly modalService: ModalService = inject(ModalService);
  
  message: string = '';
  isVisible: boolean = false;

  ngOnInit() {
    this.modalService.modalData$.subscribe(data => {
      this.message = data.message;
      this.isVisible = true;
    });
  }

  close(): void {
    this.isVisible = false;
    this.modalService.closeModal();
  }
}
