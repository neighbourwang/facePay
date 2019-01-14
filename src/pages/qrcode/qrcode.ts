import { Component } from '@angular/core';
import { NavController } from 'ionic-angular'
import { AlertController } from 'ionic-angular';
// import { Alipay } from '@ionic-native/alipay';
// import { MinePage } from '../mine/mine'
// import { Camera, CameraOptions } from '@ionic-native/camera'
import { StatusBar } from '@ionic-native/status-bar';

import { wyHttpService } from '../../config/http.service'
import { UserService } from '../../config/user.service'
import { Device } from '@ionic-native/device';
import { NavParams } from 'ionic-angular';

// import { JPush } from '@jiguang-ionic/jpush';
import { window } from 'rxjs/operators/window';

// import { window } from 'rxjs/operators/window';


@Component({
    selector: 'page-qrcode',
    templateUrl: 'qrcode.html'
})
export class QRcodePage {
    constructor(public navCtrl: NavController,
        // private camera: Camera,
        private http: wyHttpService,
        private userservice: UserService,
        private promptAlert: AlertController,
        private device: Device,
        private navParams:NavParams,
        private statusBar:StatusBar
    ) {
    }
    src:string='../../assets/imgs/iu.jpeg';
    time=null;
    user_id=null;
    open_id=null;
    countDown=10;
    ngOnInit() {
        // setTimeout(this.getH5Cameral(), 0)
        this.statusBar.hide();
        this.src=`http://qr.liantu.com/api.php?text=${this.navParams['data']['src']}`;
        console.log('iii',this.src);    
    }
    getIsAuth(){
        console.log(this.navParams['data']['path'])
        let path=this.navParams['data']['src'];
        //每隔一秒请求是否授权成功
        // setInterval(()=>{
        //     this.
        // },1000)
        if(path){

        }else{

        }
    }
    getLoginInfo(face_token) {
        console.log(face_token)
        let _self = this;
        this.http.getLoginInfo(face_token).then((data: any) => {
          console.log('注册信息',data)
          if (!data) {
            let loginSuccessAlert = this.promptAlert.create({
              title: '提示',
              message: "未检测到注册信息，请注册后尝试",
              buttons: [
                // {
                //   text: '取消',
                //   handler: data => {
                //     console.log('detect failed');
                //   }
                // },
                {
                  text: '确认',
                  handler: data => {
                    // console.log('detect failed');
                    // this.getH5Cameral()
                  }
                }
              ]
            })
            loginSuccessAlert.present();
          } else {
            _self.user_id = data['user_id']
            const prompt = this.promptAlert.create({
              title: '提示',
              message: "输入手机4位尾号确认",
              inputs: [
                {
                  name: 'phonenumber',
                  placeholder: '手机尾号四位'
                }
              ],
              buttons: [
                {
                  text: '取消',
                  handler: data => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: '确认',
                  handler: data => {
                    // this.aliAccount = data['aliAccount'];
                    // console.log('保存',data['请输入支付宝账号']);
                    // console.log('保存', data['aliAccount']);
                    // console.log('保存', data['phonenumber']);
                    // console.log('保存', face_token);
                    // this.register(_self.face_token, _self.phoneNumber, _self.imgBase)
                    // if (data['phonenumber'] == _self.phoneNumber.slice(-4)) {
                    //   _self.isUser = true;
                    //   this.payPath="zhifubao"
                    //   // _self.userservice.login(_self.face_token, _self.imgBase, null, _self.user_id, data.phonenumber)
                    // } else {
                    //   return false;
                    // }
                  }
                }
              ]
            });
            prompt.present();
          }
          // this.userservice.login(face_token, base64)
          // let loginSuccessAlert = this.promptAlert.create({
          //     title: '提示',
          //     message: "登陆成功",
          //     buttons: [
          //          {
          //             text: '确认',
          //             handler: data => {
          //                 console.log('loginSuccesss');
          //                 // this.navCtrl.pop()
          //             }
          //         }
          //     ]
          // })
          // loginSuccessAlert.present();
        })
      }
    ionViewWillEnter() {
        console.log('register')
    }
   
    ionViewWillLeave() {
        console.log('willleave')
        
    }
    ngOnDestroy() {
        console.log('des')
    }
    backToMine(e) {
        this.navCtrl.pop()
    }
}