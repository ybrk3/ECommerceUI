import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List_Product } from 'src/contracts/list_product';
import { FileService } from 'src/services/common/file.service';
import { ProductService } from 'src/services/common/models/product.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  currentPageNo: number;
  products: List_Product[];
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 3;
  pageList: number[];
  baseStorageUrl: string;

  constructor(
    private productService: ProductService,
    private toastrService: CustomToastrService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {}

  async ngOnInit() {
    this.baseStorageUrl = await this.fileService.getBaseStorageUrl();

    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = parseInt(params['pageNo'] ?? 1);

      const allProducts: {
        totalProductCount: number;
        products: List_Product[];
      } = await this.productService.read(
        this.currentPageNo - 1,
        this.pageSize,
        () => {},
        (errorMessage) => {
          this.toastrService.message(errorMessage, 'An error occured!', {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopCenter,
          });
        }
      );

      this.products = allProducts.products.map<List_Product>((p) => {
        const listProduct: List_Product = {
          id: p.id,
          name: p.name,
          stock: p.stock,
          price: p.price,
          imagePath: p.images.length
            ? p.images.find((p) => p.showcase).path
            : '',
          UpdatedDate: p.UpdatedDate,
          createdDate: p.createdDate,
        };
        return listProduct;
      });
      this.totalProductCount = allProducts.totalProductCount;
      //Pagination
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.currentPageNo - 2 <= 0) {
        for (let i = 1; i <= 5; i++)
          if (i <= this.totalPageCount) this.pageList.push(i);
      } else if (this.currentPageNo + 3 > this.totalPageCount) {
        for (let i = this.totalPageCount - 4; i <= this.totalPageCount; i++)
          if (i > 0) this.pageList.push(i);
      } else {
        for (let i = this.currentPageNo - 2; i <= this.currentPageNo + 2; i++)
          this.pageList.push(i);
      }
    });
  }
}
