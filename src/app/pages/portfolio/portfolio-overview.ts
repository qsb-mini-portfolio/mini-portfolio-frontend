import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { UserService } from '../../services/user/userService';
import { PortfolioService } from '../../services/portfolio/portfolio.service';
import { StocksService } from '../../services/stock/stocks.service';
import { ImportCsvDialog } from './import-csv/import-csv-dialog';
import { TransactionDialog } from './transaction-dialog/transaction-dialog';
import { StockResponse } from '../../models/stock/stockResponse';
import { ToastrService } from 'ngx-toastr';
import { AddTransactionDialog } from './add-transaction-dialog/add-transaction-dialog';
import { Pagination } from '../../models/pagination';
import { Transaction } from '../../models/transaction/transaction';
import { Utils } from '../../utils/utils';
import { TransactionService } from '../../services/transaction/transaction.service';
import { TransactionSeverityPipe } from "../../utils/pipe/transactionBuyPipe";
import { AbsPipe } from "../../utils/pipe/absPipe";
import { DateOrNonePipe } from "../../utils/pipe/dateOrNonePipe";
import { Portfolio } from '../../models/portfolio/portfolio.model';
import { Position } from '../../models/portfolio/position.model';
import { CurrencyOrNonePipe } from "../../utils/pipe/currencyOrNonePipe";
import { PercentageOrNonePipe } from "../../utils/pipe/percentageOrNonePipe";

@Component({
  selector: 'app-portfolio-overview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputNumberModule,
    DatePickerModule,
    FormsModule,
    ImportCsvDialog,
    AddTransactionDialog,
    TransactionDialog,
    TransactionSeverityPipe,
    AbsPipe,
    DateOrNonePipe,
    CurrencyOrNonePipe,
    PercentageOrNonePipe
],
  templateUrl: './portfolio-overview.html',
  styleUrls: ['./portfolio-overview.scss']
})
export class PortfolioOverview implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  private toastr = inject(ToastrService);
  private readonly transactionService = inject(TransactionService);

  transactions = signal<Pagination<Transaction>>(Utils.emptyPagination<Transaction>());
  portfolio = signal<Portfolio | undefined>(undefined);
  positions = signal<Position[]>([]);
  transactionLoading = signal<boolean>(false);
  portfolioLoading = signal<boolean>(false);

  private currentPage = 0;

  @ViewChild('importCsvDialog') importCsvDialog!: ImportCsvDialog;
  @ViewChild('transactionDialog') transactionDialog! : TransactionDialog;
  @ViewChild('addTransactionDialog') addTransactionDialog!: AddTransactionDialog;

  openAddTransaction() {
    this.addTransactionDialog.open();
  }

  openImport() {
    this.importCsvDialog.open();
  }

  openTransaction(transaction: Transaction) {
    this.transactionDialog.open(transaction);
  }
  
  refresh() {
    this.loadTransaction();
    this.loadPortfolio();
  }

  onCSVImported() {
    this.toastr.success("CSV Imported !", "Success:");
    this.refresh();
  }

  onTransactionCreated() {
    this.toastr.success("Transaction created !", "Success:");
    this.refresh();
  }

  onDeleteTransaction() {
    this.toastr.success("Transaction deleted !", "Success:");
    this.refresh();
  }

  onUpdateTransaction() {
    this.toastr.success("Transaction updated !", "Success:");
    this.refresh();
  }

  async ngOnInit() {
    this.loadTransaction();
    this.loadPortfolio();
    this.getFavoriteStocks();
  }

  loadTransaction() {
    this.transactionLoading.set(true);
    this.transactionService.loadTransaction(this.currentPage, 10).subscribe({
      next:(resp) => {
        this.transactions.set(resp);
        this.transactionLoading.set(false);
      },
      error:(err) => console.error('Unable to load the transactions')
    })
  }

  loadPortfolio() {
    this.portfolioLoading.set(true);
    this.portfolioService.loadPortfolio().subscribe({
      next:(resp) => { 
        this.portfolio.set(resp);
        this.positions.set(resp.stocks);
        this.portfolioLoading.set(false);
      },
      error:(err) => console.error('Unable to load the portfolio')
    })
  }

  onPageChange(event: any): void {
    this.currentPage = event.first / 10;
    this.loadTransaction();
  }

  tagPerformance(pct?: number) {
    return pct ? (pct > 0 ? 'success' : 'danger') : 'neutral';
  }

  liked = false;

  // GESTION DES STOCKS FAVORIS

  favoriteStocks : StockResponse[] = [];
  favoriteStocksSymbols : string[] = []
  likedSymbols: Set<string> = new Set();

  getFavoriteStocks() {
    this.userService.getFavoriteStock().subscribe({
      next: (response) => {
        this.favoriteStocksSymbols = response.stocks.map(s => s.symbol);
        this.likedSymbols = new Set(this.favoriteStocksSymbols);
      }
    });
  }


  toggleLike(p: any) {
    if (this.likedSymbols.has(p.symbol)) {
        this.likedSymbols.delete(p.symbol);
        this.userService.deleteFavoriteStock(p.symbol).subscribe();
    } else {
        this.likedSymbols.add(p.symbol);
        this.userService.addFavoriteStock(p.symbol).subscribe();
    }
  }
  showOnlyFavorites = false;

  toggleFavoriteFilter() {
    this.showOnlyFavorites = !this.showOnlyFavorites;
  }

  get filteredStocks() {
    const allPositions = this.positions(); 
    return this.showOnlyFavorites
      ? allPositions.filter(p => this.likedSymbols.has(p.symbol))
      : allPositions;
  }

  // Gestion des transactions 

    readonly transactionForm = this.fb.nonNullable.group(
    {
      id : "",
      date: new Date(),
      volume: 100,
      price: 100,
    }, { validators: [
        (g) => (g.value.volume ?? 0) > 0 && (g.value.price ?? 0) > 0 ? null : { invalidNumbers: true }
      ]}
  );
}
