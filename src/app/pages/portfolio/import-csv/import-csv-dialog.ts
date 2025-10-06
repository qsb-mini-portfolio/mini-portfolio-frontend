import {Component, EventEmitter, inject, Output, signal} from '@angular/core';
import {
  FileSelectEvent,
  FileUploadHandlerEvent,
  FileUploadModule
} from 'primeng/fileupload';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {ProgressBarModule} from 'primeng/progressbar';
import { TransactionService } from '../../../services/transaction/transaction.service';

@Component({
  selector: 'app-import-csv-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, FileUploadModule, ButtonModule, ProgressBarModule],
  templateUrl: 'import-csv-dialog.html',
  styleUrls: ['./import-csv-dialog.scss'],
})
export class ImportCsvDialog {

  private readonly transactionService = inject(TransactionService);
  
  selectedFile = signal<File | null>(null);
  visible = signal(false);
  loading = signal(false);

  @Output() completed = new EventEmitter<void>();

  open()  { 
    this.visible.set(true); 
  }

  onSelect(e: FileSelectEvent) {
    const file = e.files?.[0];
    this.selectedFile.set(file ?? null);
  }

  onClear() {
    this.selectedFile.set(null);
  }

  onUpload(e: FileUploadHandlerEvent) {
    const file = e.files?.[0] as File | undefined;
    if (!file) return;

    this.loading.set(true);
    this.transactionService.importCsv(file).subscribe({
      next: (res) => { 
        this.loading.set(false); 
        this.visible.set(false); 
        this.completed.emit();
      },
      error: (err) => console.error('Unable to import the CSV')
    });
  }
}
