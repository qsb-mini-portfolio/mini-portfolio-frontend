import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCsvDialog } from './import-csv-dialog';

describe('ImportCsvDialog', () => {
  let component: ImportCsvDialog;
  let fixture: ComponentFixture<ImportCsvDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportCsvDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportCsvDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
