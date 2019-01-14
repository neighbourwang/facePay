import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { OrderPage } from '../orders/order';
import { NavParams } from 'ionic-angular';
import { Component, OnInit, Input ,Output, EventEmitter} from '@angular/core';
import { wyHttpService } from '../../config/http.service'
import { UserService } from '../../config/user.service'
@Component({
    selector: 'pay-path',
    templateUrl: 'paypath.html'
})
export class PayPathPage {
    @Input() payOrder: any;
    @Output()
    cancel = new EventEmitter();
    @Output()    
    payType =new EventEmitter();
    constructor(public navCtrl: NavController,
        private http: wyHttpService,
        private userservice: UserService,
        private promptAlert: AlertController,
        private navParams: NavParams) {
    }

    ngOnInit() {
        // setTimeout(this.getH5Cameral(), 0)
        console.log('iii');

    }
    pay(type){
        console.log(type)
        this.payType.emit(type);
    }
    cancelPay(){
        console.log('cancelPay');
        this.cancel.emit();
    }

    ionViewWillLeave() {
        console.log('willleave')
        console.log(this.userservice.userInfo)
    }

}
