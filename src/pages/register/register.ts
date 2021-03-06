import { Component } from '@angular/core';
import { NavController } from 'ionic-angular'
import { AlertController } from 'ionic-angular';
// import { Alipay } from '@ionic-native/alipay';
// import { MinePage } from '../mine/mine'
// import { Camera, CameraOptions } from '@ionic-native/camera'
import { QRcodePage } from '../qrcode/qrcode';
import { StatusBar } from '@ionic-native/status-bar';

import { wyHttpService } from '../../config/http.service'
import { UserService } from '../../config/user.service'
import { Device } from '@ionic-native/device';
// import { JPush } from '@jiguang-ionic/jpush';
import { CameraPreviewService } from '../../providers/cameraPreview.service';
import { window } from 'rxjs/operators/window';
import { ElementRef, Renderer2 } from '@angular/core';

// import { window } from 'rxjs/operators/window';
declare var cordova: any;


@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    constructor(public navCtrl: NavController,
        // private camera: Camera,
        private http: wyHttpService,
        private userservice: UserService,
        private promptAlert: AlertController,
        private device: Device,
        private previewcamera: CameraPreviewService,
        private statusBar: StatusBar,
        private ElementRef: ElementRef,
        private Renderer2: Renderer2
    ) {
        let _self = this;
        window['getCode'] = function (arg) {
            console.log('getCode', arg)
            _self.getUserId(arg);
        }
        console.log(document['clientWidth'])
    }
    streamTrack = [];
    imgBase = '';
    phoneNumber = null;
    user_id = null;
    face_token = null;
    int1 = null;
    int2 = null;
    i = 0;
    aliAccount = null;
    video = null;
    canvas = null;
    ctx = null;
    authSign = null;
    previewOn: boolean = false;
    body = null;
    deviceWidth = 375;
    currentStyles: {};
    dom = null;
    myVideo = null;
    viewDiv = null;
    fillDiv = null;
    preview = true;
    pageWidth = 0;
    pageHeight = 0;
    ngOnInit() {
        // setTimeout(this.getH5Cameral(), 0)
        console.log('iii');
        this.statusBar.hide();
        this.preview = true;
    }
    ionViewWillEnter() {
        console.log('register')
        console.log(this.device)
        this.preview = true;
        this.pageWidth = this.ElementRef.nativeElement.querySelector('.registerPage').clientWidth;
        this.pageHeight = this.ElementRef.nativeElement.querySelector('.registerPage').clientHeight;
        this.viewDiv = this.ElementRef.nativeElement.querySelector('.trView');
        this.fillDiv = this.ElementRef.nativeElement.querySelector('.fillDiv');
        console.log(this.viewDiv.clientWidth)
        this.viewDiv.setAttribute('style', `height:${this.pageWidth}px`)
        this.fillDiv.setAttribute('style', `top:${this.pageWidth + 50}px`)
        // console.log(this.device.platform)
        if (!this.userservice.isLogin()) {
            this.takePicture()
        }
        // this.drawImage(false)
    }
    setCurrentStyles() {
        // CSS styles: set per current state of component properties
        this.currentStyles = {
            'width': this.deviceWidth,
            'height': this.deviceWidth
        };
    }
    takePicture() {
        let _self = this;
        this.previewOn = true;
        // await this.
        // if (this.device.platform == "iOS") {
        console.log('ios')
        _self.previewcamera.startCamera(this.pageWidth, this.pageWidth).then(data => {
            console.log('previewcamera', data)
            _self.previewcamera.getSupportedFlashModes().then(data => {
                console.log(data)
                if (data.length > 0) {
                    //   _self.previewcamera.getFlashMode().then(data => {
                    //     console.log(data)
                    //   })
                    return _self.previewcamera.setFlashMode('off').then(data => {
                        console.log(data)
                    })
                }
            }).then(() => {
                setTimeout(() => {
                    this.previewcamera.takePicture(this.pageWidth, this.pageWidth).then(data => {
                        _self.askServer(`data:image/jpeg;base64,${data[0]}`)
                        // console.log(_self.base64)
                        // _self.img = new Image()
                        _self.imgBase = `data:image/jpeg;base64,${data[0]}`;
                        // _self.previewcamera.StopCameraPreview()
                        // _self.drawImage();
                        // _self.previewOn = false;
                    })
                }, 500)
            })
            // setTimeout(() => {

            // }, 0)
        }).catch(err => {
            console.log(err)
        });
        // } else {
        //     console.log('android')
        //     this.getH5Cameral()
        // }
    }
    drawCanvas() {
        this.preview = false;
        this.myVideo = this.ElementRef.nativeElement.querySelector('.myVideo');
        console.log(this.pageWidth)
        this.myVideo.setAttribute('style', `height:${this.pageWidth}px;width:${this.pageWidth}px`)
        this.canvas = document.getElementById('canvas2');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', `${this.pageWidth}px`)
        this.canvas.setAttribute('height', `${this.pageWidth}px`)
        var img = new Image();
        // img.src = '../../assets/imgs/iu.jpeg';
        img.src = this.imgBase;
        let _self = this;
        img.onload = function () {
            _self.circleImg(_self.ctx, img, _self.pageWidth / 2 - _self.pageWidth * 7 / 20, _self.pageWidth / 2 - _self.pageWidth * 7 / 20, _self.pageWidth * 7 / 20);
            // _self.ctx.drawImage(img, 0,0);
            _self.stopCameral();  
        }
    }
    circleImg(ctx, img, x, y, r) {
        ctx.save();
        var d = 2 * r;
        var cx = x + r;
        var cy = y + r;
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, x, y, d, d);
        ctx.restore();
    }
    backToMine(e) {
        // console.log('taped', e)
        // if(AlipayJSBridge!=undefined){};
        // try {
        //     AlipayJSBridge.call('closeWebview')
        // } catch (error) {
        //     console.log(error)
        // }
        this.stopCameral();
        // this.navCtrl.push(MinePage, {
        //     // isLogin:this.islogin
        // })
        this.navCtrl.pop()
    }
    // getPicture(options: CameraOptions = {}) {
    //     const ops: CameraOptions = {
    //         quality: 100,
    //         destinationType: this.camera.DestinationType.DATA_URL,
    //         encodingType: this.camera.EncodingType.JPEG,
    //         mediaType: this.camera.MediaType.PICTURE
    //     };
    //     return this.camera.getPicture(ops).then((imgData: string) => {
    //         // if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
    //         //     console.log('data:image/jpg;base64,' + imgData);
    //         // } else {
    //         console.log(imgData);
    //         // }
    //     }).catch(err => {
    //         if (err == 20) {
    //             alert('没有权限,请在设置中开启权限');
    //         } else if (String(err).indexOf('cancel') != -1) {
    //             console.log('用户点击了取消按钮');
    //         } else {
    //             console.log(err, '使用cordova-plugin-camera获取照片失败');
    //             alert('获取照片失败');
    //         }
    //     });
    // }
    getH5Cameral() {
        let _self = this;
        console.log('123')
        // video.srcObject = null; 
        // console.log(navigator.mediaDevices)
        // console.log(navigator.mozGetUserMedia)
        // console.log(navigator.webkitGetUserMedia)
        // console.log(navigator.getUserMedia)

        // if (navigator.mediaDevices === undefined) {
        //     // navigator.mediaDevices = {};
        // }
        // console.log(navigator.mediaDevices)
        // // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia 
        // // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
        // if (navigator.mediaDevices.getUserMedia === undefined) {
        //     navigator.mediaDevices.getUserMedia = function (constraints) {

        //         // 首先，如果有getUserMedia的话，就获得它
        //         var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        //         // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
        //         if (!getUserMedia) {
        //             return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        //         }

        //         // 否则，为老的navigator.getUserMedia方法包裹一个Promise
        //         return new Promise(function (resolve, reject) {
        //             getUserMedia.call(navigator, constraints, resolve, reject);
        //         });
        //     }
        // }
        // navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 300, height: 300 }, audio: false }).then(stream => {
        //     navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
        //     // video.setAttribute('height','300')
        //     // console.log(stream)
        //     // let video = document.getElementById('video');

        //     this.video.srcObject = stream;
        //     // console.log('ww',_self.video.videoHeight)

        //     this.video.onloadedmetadata = function (e) {
        //         _self.video.play();
        //     };
        //     _self.streamTrack = stream.getVideoTracks();
        //     setTimeout(() => {
        //         _self.drawImage()
        //     }, 1700)
        //     // setTimeout(() => {
        //     //     // console.log(canvas.toDataURL('image/png').slice(22))
        //     //     _self.askServer(_self.canvas.toDataURL("image/png"))
        //     // }, 2500)
        // }).catch(err => {
        //     // alert(err.name)
        //     // alert(err.message)
        //     console.log(err)
        // })
        navigator.getUserMedia({ video: { width: 300, height: 300 }, audio: false }, stream => {
            // navigator.getUserMedia({ video: true, audio: false }, stream => {
            // video.setAttribute('height','300')
            // console.log(stream)
            // let video = document.getElementById('video');

            this.video.srcObject = stream;
            // console.log('ww',_self.video.videoHeight)

            this.video.onloadedmetadata = function (e) {
                _self.video.play();
            };
            _self.streamTrack = stream.getVideoTracks();
            setTimeout(() => {
                _self.drawImage(false)
            }, 1700)
            setTimeout(() => {
                // console.log(canvas.toDataURL('image/png').slice(22))
                _self.askServer(_self.canvas.toDataURL("image/png"))
            }, 2500)
        }, err => {
            // alert(err.name)
            // alert(err.message)
            console.log(err)
            console.log(err.name)
            console.log(err.message)
        })
    }
    drawImage(rectangle) {
        // let _self = this;
        // if(this.video.paused||this.video.ended){
        //     console.log('video stop')
        //     return
        // }
        console.log('drawing', rectangle, this.deviceWidth)
        // if (this.device.platform == "iOS") {
        // } else {
        //     this.int1 = setInterval(() => {
        //         this.ctx.drawImage(this.video, 0, 0);
        //     }, 50)
        // }
        // setTimeout(_self.drawImage(),0)
        // setTimeout(_self.stopCameral(),10000)

        if (rectangle) {
            this.ctx.drawImage(this.imgBase, rectangle.left > 0 ? rectangle.left : 0, rectangle.top, this.deviceWidth, this.deviceWidth, 0, 0, this.deviceWidth, this.deviceWidth);
            // this.ctx.drawImage(this.img,0,0);
        } else {
            // this.int1 = setInterval(() => {
            // this.ctx.drawImage(this.video, 0, 0);
            let img = new Image();
            img.src = '../../assets/imgs/iu.jpeg';
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                // console.log(this.canvas.toDataURL("image/png"))
            }

            //     }, 50)
        }
    }
    stopCameral() {
        this.previewcamera.StopCameraPreview()
        // if (this.streamTrack.length == 0) return;
        // // let stream = video.srcObject;
        // // let tracks = stream.getTracks();
        // this.streamTrack.forEach(function (track) {
        //     track.stop();
        // });

        // this.video.srcObject = null;
        // // this.streamTrack[0].stop();
        // // let video = document.getElementById('video');
        // // video.stop();
        // clearInterval(this.int1);
        // this.int1 = null;
        // // clearInterval(this.int2)

    }
    askServer(base64) {
        // this.imgBase=base64;
        // console.log(this.imgBase)
        // console.log(base64.replace(/'+'/g,'%2B'))
        // if (this.i == 5) {
        //     this.stopCameral();
        // }
        // console.log(base64)
        // this.http.getFaceInfo(base64).then((data)=>{
        //    console.log(data)
        // },err=>{
        //    console.log(err) 
        // });
        // this.http.groupCreate();
        //云从
        // this.http.faceCreate(base64).then((data)=>{
        //     console.log(data)
        //     return this.http.groupAddFace(data)
        //  });
        //face++
        // this.http.faceDetect(base64).then(data=>{
        //     console.log(data.faces[0].face_token)
        //     return this.http.faceSetAddface(data.faces[0].face_token)
        // }).catch(err=>{
        //     console.log(err)
        // })
        //在人脸群中查找
        let _self=this;
        this.http.faceSearch(base64.slice(22)).then((data: any) => {
            console.log(data)
            //查到登陆成功
            if (data.faces.length == 0) {
                let loginSuccessAlert = this.promptAlert.create({
                    title: '提示',
                    message: "未检测到人脸信息，请点确认重新检测",
                    buttons: [
                        {
                            text: '取消',
                            handler: data => {
                                console.log('detect failed');
                            }
                        },
                        {
                            text: '确认',
                            handler: data => {
                                this.previewcamera.takePicture(this.pageWidth, this.pageWidth).then(data => {
                                    _self.askServer(`data:image/jpeg;base64,${data[0]}`)
                                    // console.log(_self.base64)
                                    // _self.img = new Image()
                                    _self.imgBase = `data:image/jpeg;base64,${data[0]}`;
                                    // _self.previewcamera.StopCameraPreview()
                                    // _self.drawImage();
                                    // _self.previewOn = false;
                                })
                            }
                        }
                    ]
                })
                loginSuccessAlert.present();
            } else {
                // console.log(data.results[0].confidence > 90)
                // this.drawImage(data.faces[0].face_rectangle);
                // this.previewcamera.takePicture(this.pageWidth, this.pageHeight).then(data => {
                //     this.imgBase = `data:image/jpeg;base64,${data[0]}`;
                // })
                this.drawCanvas()
                if (data.results[0].confidence > 75) {
                    this.getLoginInfo(data.results[0].face_token)
                } else {
                    this.showPrompt(data.faces[0].face_token)
                }
            }
        }).catch(err => {
            console.log(err)
        })

    }
    showPrompt(face_token) {
        let _self = this;
        const prompt = this.promptAlert.create({
            title: '提示',
            // message: "输入手机后四位尾号，点击确认跳转支付授权页面，授权成功后完成注册",
            message: "输入手机号完成注册后扫描二维码完成授权",
            inputs: [
                {
                    name: 'phonenumber',
                    placeholder: '请输入手机号'
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
                    text: '保存',
                    handler: data => {
                        // if()
                        console.log(data['phonenumber'])
                        // let reg = /\d{4}/
                        let reg = /^1[0-9]{10}$/
                        if (!reg.test(data['phonenumber'])) {
                            return false;
                        }
                        // this.aliAccount = data['aliAccount'];
                        // console.log('保存',data['请输入支付宝账号']);
                        // console.log('保存', data['aliAccount']);
                        // console.log('保存', data['phonenumber']);
                        // console.log('保存', face_token);
                        // this.register(face_token, data['phonenumber'], base64)
                        _self.face_token = face_token;
                        _self.phoneNumber = data['phonenumber']
                        // _self.getSignInfo()
                        _self.register();
                    }
                }
            ]
        });
        prompt.present();
    }
    //查询注册信息
    getLoginInfo(face_token) {
        console.log(face_token)
        let _self = this;
        this.http.getLoginInfo(face_token).then((data: any) => {
            console.log('用户注册信息', data)
            // console.log(JPush)
            // JPush['setAlias']({ sequence: 1, alias: data[0][2] }).then((result) => {
            //     console.log('alias',result)
            //     // var sequence = result.sequence
            //     // var alias = result.alias
            // }, (error) => {
            //     console.log(error)
            //     // var sequence = error.sequence
            //     // var errorCode = error.code
            // })
            if (data && data.user_id) {
                let loginSuccessAlert = this.promptAlert.create({
                    title: '提示',
                    message: "登陆成功",
                    buttons: [
                        {
                            text: '确认',
                            handler: tdata => {
                                console.log('loginSuccesss',data);
                                let baseCanvas = this.canvas.toDataURL("image/png");                                
                                this.userservice.login(data.face_id, baseCanvas, null, data.user_id, data.phonenumber)
                                // alert('已授权')
                                this.navCtrl.pop()
                            }
                        }
                    ]
                })
                loginSuccessAlert.present();
            } else if (data && !data['auth'] && data['phonenumber'] && data['face_id']) {
                let loginSuccessAlert = this.promptAlert.create({
                    title: '提示',
                    message: "点击确认扫描二维码完成授权",
                    buttons: [
                        {
                            text: '确认',
                            handler: tdata => {
                                console.log('gpauth');
                                _self.phoneNumber = data.phonenumber;
                                _self.face_token = data.face_id;
                                let baseCanvas = this.canvas.toDataURL("image/png");
                                this.userservice.login(data.face_id, baseCanvas, null, data.user_id, data.phonenumber)
                                _self.qrcode()
                            }
                        },
                        {
                            text: '以后再说',
                            handler: tdata => {
                                console.log('cancelpauth');
                                let baseCanvas = this.canvas.toDataURL("image/png");
                                this.userservice.login(data.face_id, baseCanvas, null, data.user_id, data.phonenumber)
                                this.navCtrl.pop()
                            }
                        }
                    ]
                })
                loginSuccessAlert.present();
            } else {
                console.log('未发现注册DB信息')
                this.http.removeAllFaces(face_token).then(data => {
                    console.log(data);
                    let loginSuccessAlert = this.promptAlert.create({
                        title: '提示',
                        message: "未检测到注册信息，请点确认重新检测",
                        buttons: [
                            {
                                text: '取消',
                                handler: data => {
                                    console.log('detect failed');
                                }
                            },
                            {
                                text: '确认',
                                handler: tdata => {
                                   this.takePicture()
                                }
                            }
                        ]
                    })
                    loginSuccessAlert.present();
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }
    //注册
    register() {
        console.log(this.face_token)
        console.log(this.phoneNumber)
        // console.log(this.user_id)
        let _self = this;
        if (!this.face_token || !this.phoneNumber) {
            alert('信息错误')
            return
        }
        return Promise.all([this.http.registerDB(this.face_token, this.phoneNumber), this.http.faceSetAddface(this.face_token)]).then(data => {
            console.log('ss', data)
            //未授权时注册设备id
            let baseCanvas = _self.canvas.toDataURL("image/png");                                
            _self.userservice.login(_self.face_token, baseCanvas, null, this.device.uuid, _self.phoneNumber)
            // let registerSuccessAlert = this.promptAlert.create({
            //     title: '提示',
            //     message: "注册成功,点击确认进入授权页面",
            //     buttons: [
            //         {
            //             text: '确认',
            //             handler: data => {
            //                 console.log('registerSuccesss');
            //                 // this.navCtrl.pop()
            _self.qrcode()
            //             }
            //         }
            //     ]
            // })
            // registerSuccessAlert.present();
        }).catch(err => {
            console.log('ee')

            console.log(err)
        })
        // console.log('dd')
        // this.http.registerDB(this.face_token, this.phoneNumber,this.user_id).then(data => {
        //     // console.log(data)
        // }).then(() => {
        //     return this.http.faceSetAddface(this.face_token).then(data => {
        //         this.userservice.login(this.face_token, this.imgBase,null,this.user_id,this.phoneNumber)
        //         let registerSuccessAlert = this.promptAlert.create({
        //             title: '提示',
        //             message: "注册成功",
        //             buttons: [
        //                 {
        //                     text: '确认',
        //                     handler: data => {
        //                         console.log('registerSuccesss');
        //                         // this.navCtrl.pop()
        //                     }
        //                 }
        //             ]
        //         })
        //         registerSuccessAlert.present();
        //     })
        // })
        // this.http.registerDB('dcc9adbb8533bc083083bef62795a8e7', 6499,'2088402239622912').then((data :any)=> {
        //     console.log(data);
        // }).catch(err => {
        //     console.log(err)
        // })
    }

    ready(callback) {
        // console.log('3j', window.AlipayJSBridge)
        // if (window.AlipayJSBridge) {
        //     console.log('5jj')
        //     callback && callback();
        // } else {
        //     document.addEventListener('AlipayJSBridgeReady', callback, false);
        // }
    }
    tradePay(tradeNO) {
        // console.log('1jj', ap)
        // this.ready(function () {
        //     console.log('2jj')
        //     // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
        //     AlipayJSBridge.call("tradePay", {
        //         tradeNO: tradeNO
        //     }, function (data) {
        //         console.log('zhifu',JSON.stringify(data));
        //         if ("9000" == data.resultCode) {
        //             console.log("支付成功");
        //         }
        //     });
        // });
        // ap.tradePay({
        //     // tradeNO: tradeNO
        //     tradeNO: '2018072021001004650538446132'
        //     // let url=`http://10.10.0.124:8082/createOrder`
        // }, function (res) {
        //     ap.alert(res.resultCode);
        // });
    }
    //getwangzi获取授权签名字符串
    getSignInfo() {
        // console.log()
        let _self = this;
        this.userservice.userInfo.targetId = new Date().getTime();
        // console.log(targetId)
        this.http.getSignInfo(this.userservice.userInfo.targetId).then((data: any) => {
            console.log(data);
            _self.authSign = data.sign
            _self.getAuth()
        }).catch(err => {
            console.log(err)
        })
    }
    //支付宝授权
    getAuth() {
        let _self = this;
        // string = string ? string : "apiname=com.alipay.account.auth&app_id=2018062660475092&app_name=mc&auth_type=AUTHACCOUNT&biz_type=openservice&method=alipay.open.auth.sdk.code.get&pid=2088131533593230&product_id=APP_FAST_LOGIN&scope=kuaijie&sign_type=RSA&target_id=wz1433223&sign=fzgofPWWGppB%2FQYUpxg%2F16p9vG5JqWVbtSrgFLp8tYEoQzLOUulmcrmFrOSaCTMHjzU2ZXWsKdp%2BJqRMhxTNSIKBjEToenyg8BtFmdAJG1QT28VsMpzC63vjbb6Dw3xWDnsUp1edNs81dx8Z%2BcFIqlrgnAwvp15Jy6yqYL4NwKtJu%2B8fxsGLwQCeEqlwnSBzeyoBTpa%2BKmjXIccQykwKM12eHdaLJkoRHUXv%2BwE8tBXx2GxnNDRh1xEwRaofXEYhcEf7OuCWV45QbZhvQVDzNT1XDjQ9dYunu4N5eAu2hYmyXNy55MwEQeuXxqqBWNG%2FL%2Bqvsy%2Bcw%2FvlaMCd5rgHIQ%3D%3D";
        // alert('android')
        // string=`apiname=com.alipay.account.auth&app_id=2018062660475092&app_name=mc&auth_type=AUTHACCOUNT&biz_type=openservice&method=alipay.open.auth.sdk.code.get&pid=2088131533593230&product_id=APP_FAST_LOGIN&scope=kuaijie&sign_type=RSA&target_id=1532507117357&sign=AXKe%2Btm2LoLaQ7n7UiH6RxN7A%2BKZWuENrJwjZnpS1nFGzypoollKqo6SP59ecImRFEqPfDRk1rnX7Sxy7ibnfckuHtLY8X8c8sfZKx%2FVW7vkfMftAq6F18mP9luaignkQBPm%2Fc2nNktAMGbmQ79ZqtVAh2se0A%2FVzM06DJJwkIatUe9PjxpbEwmfT1XqcIhAvR99vNIhTpmbHAjSdMYDJNbqyUn58bgb46wirFfD%2FyzZY91wMXq5IIkPkKW%2FjEj1r4YvU5ViC%2FL7ayD%2Bj5Uie385xvtY7NSmXcvFXQJ%2Bv9E1iXQCYi4zqr6wrMkpW06we1U%2Fg4212m2GBU7vPtY6Dw%3D%3D`
        if (!_self.authSign) {
            alert('授权签名错误')
            return
        }
        console.log(_self.authSign)
        // window.Android.getAuthCode(string)
        cordova.plugins.alipay.payment(_self.authSign, function success(e) {
            console.log('ff')
            console.log(e)
            if (e.resultStatus == '9000') {
                _self.getUserId(e.result);
            }
        }, function error(e) {
            console.log('dd')
            console.log(JSON.stringify(e))
            let authErrorAlert = this.promptAlert.create({
                title: '提示',
                message: e.memo,
                buttons: [
                    {
                        text: '确认',
                        handler: data => {
                            // console.log('registerSuccesss');
                            // this.navCtrl.pop()
                        }
                    }
                ]
            })
            authErrorAlert.present();
        });
    }
    getUserId(code) {
        console.log(code)
        // let _self=this;
        // let code=`{resultStatus=9000, result=success=true&result_code=200&app_id=2018062660475092&auth_code=49a0b647e5db4ea68b7d15be6c6cNX65&scope=kuaijie&alipay_open_id=20881043596191043402565740112365&user_id=2088612342671651&target_id=1532507117357, memo=}`
        let reg = /(auth_code==?)(\S*)&scope/
        console.log(code.match(reg))
        this.http.getUserId(code.match(reg)[2]).then((data: any) => {
            // this.http.getUserId('cc').then((data: any) => {
            console.log(data);
            this.user_id = data.alipay_system_oauth_token_response.user_id
            this.register()
        }).catch(err => {
            console.log(err)
        })
    }
    qrcode() {
        console.log(this.face_token, this.phoneNumber)
        // let redirectUrl=encodeURIComponent(`http://192.168.0.6:8080/Alipay/auth.html?face=${this.face_token}&phone=${this.phoneNumber}`)
        // console.log(encodeURIComponent(redirectUrl))
        // let dataText=`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018062660475092%26scope=auth_user%26redirect_uri=${redirectUrl}`
        let dataText = `http://neighbour.southeastasia.cloudapp.azure.com/Alipay/platform.html?face=${this.face_token}%26phone=${this.phoneNumber}%26uuid=${this.device.uuid}`
        console.log(dataText)
        this.navCtrl.push(QRcodePage, { 'src': dataText })
    }
    goToQRcodePage() {
        console.log('dd')
        this.navCtrl.push(QRcodePage, { 'src': '123' })
    }
    // window.getCode=function(arg) {
    //     console.log('11', arg)
    //     alert(arg);
    // }
    ionViewWillLeave() {
        console.log('willleave')
        // if (this.device.platform == "iOS") {
        console.log('ios')
        this.previewcamera.StopCameraPreview()
        // }
    }

    ngOnDestroy() {
        console.log('des')
    }
}