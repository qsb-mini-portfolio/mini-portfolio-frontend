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
import { HttpTransactionsAdapter } from '../../../services/transaction/http-transactions.adapter';

@Component({
  selector: 'app-import-csv-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, FileUploadModule, ButtonModule, ProgressBarModule],
  templateUrl: 'import-csv-dialog.html',
  styleUrls: ['./import-csv-dialog.scss'],
})
export class ImportCsvDialog {
  private _visible = signal(false);
  get isVisible(): boolean { return this._visible(); }
  set isVisible(v: boolean) { this._visible.set(v); }


  open()  { this._visible.set(true); }
  close() { this._visible.set(false); this.closed.emit(); }

  selectedFile = signal<File | null>(null);
  loading = signal(false);

  @Output() completed = new EventEmitter<{ detectedRows: number; savedRows: number }>();
  @Output() closed = new EventEmitter<void>();
  private readonly repo = inject(HttpTransactionsAdapter);

  constructor() { }

  onClose() { this.closed.emit(); }

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
    this.repo.importCsv(file).subscribe({
      next: (res) => { /* success */ this.loading.set(false); this.close(); },
      error: (err) => { /* toast */ this.loading.set(false); }
    });
  }
}
