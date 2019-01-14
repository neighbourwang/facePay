import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { MinePage } from '../mine/mine';
// import { PayPage } from '../pay/pay';
import { OrderPage } from '../orders/order';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  // tab3Root = PayPage;
  tab3Root = OrderPage;
  tab4Root = MinePage;

  constructor() {

  }
}
