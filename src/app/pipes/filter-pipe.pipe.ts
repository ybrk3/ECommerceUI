import { Pipe, PipeTransform } from '@angular/core';
import { List_Product } from 'src/contracts/list_product';

@Pipe({
  name: 'searchFilterPipe',
})
export class FilterPipePipe implements PipeTransform {
  //value is which to change
  transform(value: List_Product[], textFilter: string): List_Product[] {
    textFilter = textFilter ? textFilter.toLocaleLowerCase() : '';
    return textFilter
      ? value.filter(
          (p: List_Product) =>
            p.name.toLocaleLowerCase().indexOf(textFilter) !== -1
        )
      : value;
  }
}
