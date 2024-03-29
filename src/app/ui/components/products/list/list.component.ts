import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Add_Basket_Item } from 'src/contracts/basket/add_basket_item';
import { List_Product } from 'src/contracts/list_product';
import { ListResponseModel } from 'src/contracts/list_responseModel';
import { FileService } from 'src/services/common/file.service';
import { BasketService } from 'src/services/common/models/basket.service';
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
  pageSize: number = 6;
  pageList: number[];
  baseStorageUrl: string;

  //For search
  textFilter: string = '';

  constructor(
    private productService: ProductService,
    private toastrService: CustomToastrService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private basketService: BasketService
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
      const pagination = this.paginationPages(
        this.totalProductCount,
        this.pageSize,
        this.currentPageNo
      );
      this.pageList = pagination.pageList;
      this.totalPageCount = pagination.totalPageCount;
      /*this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

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
      }*/
    });
  }

  async addToCart(product: List_Product) {
    let _basketItem: Add_Basket_Item = new Add_Basket_Item();
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    await this.basketService.AddItemToBasket(_basketItem, () => {
      this.toastrService.message('Added to Cart', 'Added!', {
        messageType: ToastrMessageType.Succes,
        position: ToastrPosition.TopRight,
      });
    });
  }

  async getFilteredProducts(productName: string) {
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = parseInt(params['pageNo'] ?? 1);

      const allProducts: {
        totalFilteredProductCount: number;
        result: ListResponseModel<List_Product>;
      } = await this.productService.getFilteredProducts(
        this.textFilter,
        this.currentPageNo - 1,
        this.pageSize
      );
      if (allProducts.result.data) {
        this.products = allProducts.result.data.map<List_Product>((p) => {
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
      } else this.products = null;
      this.totalProductCount = allProducts.totalFilteredProductCount;
      //Pagination
      const pagination = this.paginationPages(
        this.totalProductCount,
        this.pageSize,
        this.currentPageNo
      );

      this.pageList = pagination.pageList;
      this.totalPageCount = pagination.totalPageCount;
      /*this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

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
      }*/
    });
  }

  private paginationPages(
    totalProductCount: number,
    pageSize: number,
    currentPageNo: number
  ): { pageList: number[]; totalPageCount: number } {
    const totalPageCount: number = Math.ceil(totalProductCount / pageSize);
    let pageList: number[] = [];
    if (currentPageNo - 2 <= 0) {
      for (let i = 1; i <= 5; i++) if (i <= totalPageCount) pageList.push(i);
    } else if (currentPageNo + 3 > totalPageCount) {
      for (let i = totalPageCount - 4; i <= totalPageCount; i++)
        if (i > 0) pageList.push(i);
    } else {
      for (let i = currentPageNo - 2; i <= currentPageNo + 2; i++)
        pageList.push(i);
    }
    return { pageList, totalPageCount };
  }
}
