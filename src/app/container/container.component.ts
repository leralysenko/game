import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, timer } from 'rxjs';
import { ModalService } from '../services/modal.service';
import { Colors } from '../models/colors';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {
  private readonly modalService: ModalService = inject(ModalService);

  cells: string[] = Array(100).fill(Colors.blue);
  timeLimit: number = 1000;
  playerScore: number = 0;
  computerScore: number = 0;
  gameOver: boolean = false;
  colors = Colors;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.modalState$
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      if(!res) { this.reset(); }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  start(): void {
    this.reset();
    this.playRound();
  }

  onCellClick(index: number): void {
    if (this.cells[index] === Colors.yellow) {
      this.playerScore++;
      this.updateCell(index, Colors.green);
      this.playerScore++;
      this.nextRound();
    }
  }

  private reset(): void {
    this.cells.fill(Colors.blue);
    this.playerScore = 0;
    this.computerScore = 0;
    this.gameOver = false;
  }

  private playRound(): void {
    const randomIndex = this.getRandomCellIndex();
    this.updateCell(randomIndex, Colors.yellow);

    timer(this.timeLimit)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.cells[randomIndex] === Colors.yellow) {
          this.updateCell(randomIndex, Colors.red);
          this.computerScore++;
          this.nextRound();
        }
      });
  }

  private checkGameOver(): void {
    const winner = this.playerScore >= 10 ? 'Ви перемогли!' :
                 this.computerScore >= 10 ? 'Комп\'ютер переміг!' : null;

    if (winner) {
      this.gameOver = true;
      this.modalService.openModal(winner);
    }
  }

  private updateCell(index: number, color: Colors): void {
    this.cells[index] = color;
  }
  
  private nextRound(): void {
    this.checkGameOver();
    if (!this.gameOver) {
      this.playRound();
    }
  }
  
  private getRandomCellIndex(): number {
    return Math.floor(Math.random() * 100);
  }
}
