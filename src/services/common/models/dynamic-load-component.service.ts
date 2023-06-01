import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicLoadComponentService {
  /*
   * ViewContainerRef         : Dinamik olarak yüklenecek component'i içerisinde barındıran container'dır. (Her dinamik yükleme sürecinde önceki view'leri clear etmemiz gerekmektedir.)
   */
  constructor() {}

  async loadComponent(
    componentType: ComponentType,
    viewContainerRef: ViewContainerRef
  ) {
    let _component: any = null;

    switch (componentType) {
      case ComponentType.BasketsComponent:
        //get the component
        _component = (
          await import('../../../app/ui/components/baskets/baskets.component')
        ).BasketsComponent;
        break;
    }

    viewContainerRef.clear();
    return viewContainerRef.createComponent(_component);
  }
}

//In case there will be various components to be loaded dynamically, we created a enum

export enum ComponentType {
  BasketsComponent,
}
