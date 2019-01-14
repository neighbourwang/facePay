import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { OrderPage } from '../orders/order';
import { App } from 'ionic-angular';

import { UserService } from '../../config/user.service'
import { wyHttpService } from '../../config/http.service'

import { Wechat } from '@ionic-native/wechat';
// declare var Wechat: any;

@Component({
    selector:'page-mine',
    templateUrl:'mine.html'
})
export class MinePage{
    isLogin:boolean;
    constructor(public navCtrl:NavController,
    private userservice:UserService,
    private http: wyHttpService,
    private app:App,
    private wechat: Wechat
    ){
        

    }
    ngOnInit(){
        
    }
    ionViewWillEnter(){
        console.log('willEnter1')
        this.isLogin=this.userservice.isLogin();
        console.log(this.userservice.userInfo)
    }
    registerLoginTap(e){
        console.log('tappped')
        console.log(this.navCtrl)
        // this.navCtrl.push(RegisterPage,{
        //     // isLogin:this.isLogin
        // })
        this.app.getRootNav().push(RegisterPage)
    }
    goToMyOrderPage(e){
        console.log('dd')
        this.navCtrl.push(OrderPage) 
    }
    logout(){
        this.userservice.logout();
        this.isLogin=false;
    }
    removeFace() {
        let _self=this;
        if(!this.userservice.userInfo.face_token){ return}
        return this.http.removeAllFaces(this.userservice.userInfo.face_token).then(data => {
            console.log(data);
            _self.userservice.logout();
            _self.isLogin=false;
        }).catch(err => {
            console.log(err)
        })
    }
    weChat(){
        this.http.wechatUnifiedOrder();
    }
    wechatAuth(){
        // console.log(this.wechat)
        let  scope = "snsapi_userinfo";
        let  state = "_" + (+new Date());
        
        console.log(Wechat)
        // Wechat.auth(scope, state, function (response) {
        //     // you may use response.code to get the access token.
        //     // alert(JSON.stringify(response));
        //     console.log(response)
        // }, function (reason) {
        //     alert("Failed: " + reason);
        // })
       
        this.wechat.auth("snsapi_userinfo",state).then(data=>{
            console.log(JSON.stringify(data))
        }).catch(error=>{
            console.log(error)
            console.log(error.code)
            console.log(JSON.stringify(error))
        })
        
    }
    isInstalled(){
        // Wechat.isInstalled(function (installed) {
        //     alert("Wechat installed: " + (installed ? "Yes" : "No"));
        // }, function (reason) {
        //     alert("Failed: " + reason);
        // });
        this.wechat.isInstalled().then(data=>{
            console.log('isstall',data)
        }).catch(error=>{
            console.log(error.code)
        })
    }
    wechatPay(){
        let params={
            appid:'wx13ab4a58decd95e2',
            partnerid: '1395500102', // merchant id
            prepayid: 'wx201411101639507cbf6ffd8b0779950874', // prepay id
            noncestr: '6aZ4n2ziQ5f2nhBWE8wB6dsfwi4n7x4G', // nonce
            timestamp: '1439531364', // timestamp
            sign: 'e64cc4743a57bee5834d412a5b399aca',
        }
        // Wechat.sendPaymentRequest(params,function () {
        //     alert("Success");
        // }, function (reason) {
        //     alert("Failed: " + reason);
        // })
        this.wechat.sendPaymentRequest(params)
  .then((res: any) => console.log(res))
  .catch((error: any) => console.error(error));

    }
}