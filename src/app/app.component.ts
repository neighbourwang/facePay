import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { JPush } from '@jiguang-ionic/jpush';
import { NavController } from 'ionic-angular';
import { PayPage } from '../pages/pay/pay';
import { UserService } from '../config/user.service'
import { RegisterPage } from '../pages/register/register';
import { Device } from '@ionic-native/device';
import { Debouncer } from 'ionic-angular/util/debouncer';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  // @ViewChild('myTabs') tabRef: TabsPage;
  @ViewChild('myNav') navCtrl: NavController
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private userservice: UserService, private device: Device, private Jpush: JPush) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      let isLogin = this.userservice.isLogin();
      console.log(isLogin)
      // console.log('this.device.uuid', this.device.uuid)
      // this.Jpush.init().then(res => { console.log(res) });  // 初始化
      // this.Jpush['setAlias']({ sequence: 1, alias: this.device.uuid }).then((result) => {
      //   console.log('alias', result)
      // }).catch(err => {
      //   console.log(err)
      // })
      // document.addEventListener("jpush.openNotification", (event?: any) => {
      //   console.log("===============打开推送内容===============")
      //   console.log(event)
      //   // alert(event.alert)
      //   console.log(event.extras.tradeNum)
      //   if (event.extras.tradeNum != 'll') {
      //     let url = `alipays://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=http%3A%2F%2Fneighbour.southeastasia.cloudapp.azure.com%2FaliPay%2Findex.html%3FtradeNo%3D${event.extras.tradeNum}`
      //     window.open(url, '_system', 'location=yes');
      //   }
      // }, false);
    });
  }
  ionViewDidEnter() {
    console.log('dd')
  }

}
