import { Component, OnInit } from '@angular/core';
import { HttpClientService } from 'src/services/common/http-client.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private httpClientService: HttpClientService) {}

  ngOnInit(): void {
    /*this.httpClientService
      .post(
        { controller: 'Products' },
        { name: 'Kalem', stock: 100, price: 15 }
      )
      .subscribe();*/
    /*this.httpClientService
      .put(
        { controller: 'Products' },
        {
          id: 'e25f77ed-15c3-446c-82ae-42aa4478103a',
          name: 'Renkli Kağıt',
          stock: 1000,
          price: 0.5,
        }
      )
      .subscribe();*/
    /*this.httpClientService
      .delete(
        { controller: 'Products' },
        'e25f77ed-15c3-446c-82ae-42aa4478103a'
      )
      .subscribe();*/
  }
}
