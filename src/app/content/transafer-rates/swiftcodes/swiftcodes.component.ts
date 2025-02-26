import { Component, OnInit } from '@angular/core';
import { SwiftCodeService } from '../services/swiftcode.services';
import { SwiftCodeResponse } from '../models/swift-codes.models';
import { PaginatedList } from '../../../helpers/pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-swiftcodes',
  templateUrl: './swiftcodes.component.html'
})
export class SwiftcodesComponent implements OnInit {
  swiftCodes: SwiftCodeResponse[] = [];
  loading = false;
  totalRows = 0;
  pageSize = 10;
  pageNumber = 1;
  searchValue = '';

  constructor(private swiftCodeService: SwiftCodeService) {}

  ngOnInit() {
    this.loadSwiftCodes();
  }

  loadSwiftCodes() {
    this.loading = true;
    this.swiftCodeService.getSwiftCodes(this.searchValue, this.pageNumber, this.pageSize).subscribe({
      next: (response: PaginatedList<SwiftCodeResponse>) => {
        this.swiftCodes = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    if (error?.error?.detail) {
      Swal.fire({
        title: 'Error',
        text: `${error?.error?.status}: ${error?.error?.detail}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  onSearch(event: Event) {
    const element = event.target as HTMLInputElement;
    this.searchValue = element.value;
    this.loadSwiftCodes();
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadSwiftCodes();
  }
}
