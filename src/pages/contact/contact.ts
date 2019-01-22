import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { OrderPage } from '../orders/order';
import { Platform } from 'ionic-angular';

import { wyHttpService } from '../../config/http.service'
import { UserService } from '../../config/user.service'
import { CameraPreviewService } from '../../providers/cameraPreview.service';
import { Device } from '@ionic-native/device';
import { ElementRef, Renderer2 } from '@angular/core';
import { QRcodePage } from '../qrcode/qrcode';
import { PayPathPage } from '../paypath/paypath'
import { JPush } from '@jiguang-ionic/jpush';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController,
    private http: wyHttpService,
    private userservice: UserService,
    private promptAlert: AlertController,
    private ElementRef: ElementRef,
    private platform: Platform, private previewcamera: CameraPreviewService, private device: Device, private JPush: JPush) {
  }
  streamTrack = [];
  imgBase = '';
  img = null;
  phoneNumber = null;
  user_id = null;
  open_id = null;
  face_token = null;
  int1 = null;
  int2 = null;
  i = 0;
  aliAccount = null;
  video = null;
  canvas = null;
  ctx = null;
  isUser: boolean = false;
  cameraOn: boolean = false;
  previewOn: boolean = false;
  dom = null;
  myVideo = null;
  deviceWidth = null;
  time = null;
  payPath = null;
  conViewDiv = null;
  conFillDiv = null;
  preview = true;
  pageWidth = 0;
  pageHeight = 0;
  ngOnInit() {
  }
  startAnimation() {
    this.previewOn = !this.previewOn;
  }
  ionViewWillEnter() {
    console.log('contact');
    this.pageWidth = this.ElementRef.nativeElement.querySelector('.contactpage').clientWidth;
    this.pageHeight = this.ElementRef.nativeElement.querySelector('.contactpage').clientHeight;
    this.conViewDiv = this.ElementRef.nativeElement.querySelector('.conView');
    this.conFillDiv = this.ElementRef.nativeElement.querySelector('.conFillDiv');
    this.conViewDiv.setAttribute('style', `height:${this.pageWidth}px`)
    this.conFillDiv.setAttribute('style', `top:${this.pageWidth}px`)
    //启动摄像头
    // if (!this.userservice.isLogin()) {
    this.takePicture()
    // }
  }
  takePicture() {
    let _self = this;
    // if (this.device.uuid == null) {
    //   this.isUser = true; return
    // }
    this.previewOn = true;
    // if (this.device.platform == "iOS") {
    _self.previewcamera.startCamera(this.pageWidth, this.pageHeight).then(data => {
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
            _self.imgBase = `data:image/jpeg;base64,${data[0]}`;
            _self.askServer(_self.imgBase)
            // console.log(_self.base64)
            _self.img.src = _self.imgBase;
            // _self.previewcamera.StopCameraPreview()
            // _self.drawImage();
            // _self.previewOn = false;
          })
        }, 500)
      })
    }).catch(err => {
      console.log(err)
    });
    // } else {
    //     console.log('android')
    //     this.getH5Cameral()
    // }
  }
  drawCanvas() {
    this.myVideo = this.ElementRef.nativeElement.querySelector('.PayVedio2');
    console.log(this.pageWidth)
    this.myVideo.setAttribute('style', `height:${this.pageWidth}px;width:${this.pageWidth}px`)
    this.canvas = document.getElementById('canvas1');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.setAttribute('width', `${this.pageWidth}px`)
    this.canvas.setAttribute('height', `${this.pageWidth}px`)
    var img = new Image();

    // img.src = '../../assets/imgs/iu.jpeg';
    img.src = this.imgBase;
    let _self = this;
    // img.onload=function(){
    //   console.log('ff')
    //   _self.ctx.drawImage(img,0,0)
    // }
    // return
    img.onload = function () {
      _self.circleImg(_self.ctx, img, _self.pageWidth / 2 - _self.pageWidth * 7 / 20, _self.pageWidth / 2 - _self.pageWidth * 7 / 20, _self.pageWidth * 7 / 20);
      // _self.previewcamera.StopCameraPreview()
      _self.preview = false;
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
  getH5Cameral() {
    let _self = this;
    console.log('123', this.streamTrack.length)

    if (this.cameraOn) return
    // video.srcObject = null; 
    // console.log(navigator.mediaDevices)
    // console.log(navigator.mozGetUserMedia)
    // console.log(navigator.webkitGetUserMedia)
    // console.log(navigator.getUserMedia)

    // if (navigator.mediaDevices === undefined) {
    //   navigator.mediaDevices = {};
    // }
    console.log(navigator.mediaDevices)
    // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia 
    // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    // if (navigator.mediaDevices.getUserMedia === undefined) {
    //   navigator.mediaDevices.getUserMedia = function (constraints) {

    //     // 首先，如果有getUserMedia的话，就获得它
    //     var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    //     // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
    //     if (!getUserMedia) {
    //       return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    //     }

    //     // 否则，为老的navigator.getUserMedia方法包裹一个Promise
    //     return new Promise(function (resolve, reject) {
    //       getUserMedia.call(navigator, constraints, resolve, reject);
    //     });
    //   }
    // }
    // const option={ video: { facingMode: "user", width: 300, height: 300 }, audio: false }
    // navigator.mediaDevices.getUserMedia(option).then(stream => {
    //     // navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
    //     // video.setAttribute('height','300')
    //     // console.log(stream)
    //     // let video = document.getElementById('video');

    //     this.video.srcObject = stream;
    //     console.log('ww',_self.video.videoHeight)

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

      // this.video.srcObject = stream;
      this.video.src = window.URL.createObjectURL(stream);
      // console.log('ww',_self.video.videoHeight)
      this.cameraOn = true;
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
    })
  }
  drawImage(rectangle) {
    console.log('drawing', rectangle)
    // if (this.device.platform == "iOS") {
    // } else {
    //     this.int1 = setInterval(() => {
    //         this.ctx.drawImage(this.video, 0, 0);
    //     }, 50)
    // }
    // setTimeout(_self.drawImage(),0)
    // setTimeout(_self.stopCameral(),10000)

    if (rectangle) {
      this.ctx.drawImage(this.img, rectangle.left - 50, rectangle.top - 50, 300, 300, 0, 0, 300, 300);
      // this.ctx.drawImage(this.img,0,0,300,300);
    } else {
      //     this.int1 = setInterval(() => {
      //         this.ctx.drawImage(this.video, 0, 0);
      let img = new Image();
      img.src = '../../assets/imgs/iu.jpeg';
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, 300, 300);

      }

      //     }, 50)
    }
  }
  stopCameral() {
    if (this.streamTrack.length == 0) return;
    // let stream = video.srcObject;
    // let tracks = stream.getTracks();
    this.cameraOn = false;
    this.streamTrack.forEach(function (track) {
      track.stop();
    });

    this.video.srcObject = null;
    // this.streamTrack[0].stop();
    // let video = document.getElementById('video');
    // video.stop();
    clearInterval(this.int1);
    this.int1 = null;
    // clearInterval(this.int2)
  }
  askServer(base64) {
    let _self = this;
    //在人脸群中查找
    _self.stopCameral();
    this.http.faceSearch(base64.slice(22)).then((data: any) => {
      console.log(data)
      //查到登陆成功
      if (data.faces.length == 0) {
        let loginFailAlert = this.promptAlert.create({
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
              handler: tdata => {
                this.previewcamera.takePicture(this.pageWidth, this.pageWidth).then(data => {
                  _self.imgBase = `data:image/jpeg;base64,${data[0]}`;
                  _self.askServer(_self.imgBase)
                  // console.log(_self.base64)
                  _self.img.src = _self.imgBase;
                  // _self.previewcamera.StopCameraPreview()
                  // _self.drawImage();
                  // _self.previewOn = false;
                })
              }
            }
          ]
        })
        loginFailAlert.present();
      } else {
        this.face_token = data.faces[0].face_token;
        // this.drawImage(data.faces[0].face_rectangle);
        this.drawCanvas()
        if (data.results[0].confidence > 75) {
          _self.getLoginInfo(data.results[0].face_token)
        } else {
          let loginSuccessAlert = this.promptAlert.create({
            title: '提示',
            message: "未检测到注册信息",
            // inputs: [
            //   {
            //     name: 'phonenumber',
            //     placeholder: '手机号码'
            //   }
            // ],
            buttons: [
              {
                text: '确认',
                handler: data => {
                  console.log('detect failed');
                }
              },
              // {
              //   text: '确认',
              //   handler: data => {
              //     // console.log('detect failed');
              //     // this.getH5Cameral()
              //     // this.takePicture();
              //     this.phoneNumber = data['phonenumber']
              //     this.register();
              //   }
              // }
            ]
          })
          loginSuccessAlert.present();
        }
      }
    }).catch(err => {
      console.log(err)
    })
    // this.stopCameral();
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
      // Promise.all([this.http.registerDB('dcc9adbb8533bc083083bef62795a8e7', 6499,'2088402239622912')]).then(data=>{
      console.log('ss', data)
      // this.userservice.login(this.face_token, this.imgBase, null, this.user_id, this.phoneNumber)
      // let registerSuccessAlert = this.promptAlert.create({
      //     title: '提示',
      //     message: "注册成功,点击确认进入授权页面",
      //     buttons: [
      //         {
      //             text: '确认',
      //             handler: data => {
      //                 console.log('registerSuccesss');
      //                 // this.navCtrl.pop()
      _self.qrcode(null)
      //             }
      //         }
      //     ]
      // })
      // registerSuccessAlert.present();
    }).catch(err => {
      console.log('ee')

      console.log(err)
    })

  }
  getLoginInfo(face_token) {
    console.log(face_token)
    let _self = this;
    this.http.getLoginInfo(face_token).then((data: any) => {
      console.log('注册信息', data)
      if (!data) {
        console.log('未发现注册DB信息')
        this.http.removeAllFaces(face_token).then(data => {
          console.log(data);
          let loginFailAlert = this.promptAlert.create({
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
                  this.previewcamera.takePicture(this.pageWidth, this.pageWidth).then(data => {
                    _self.imgBase = `data:image/jpeg;base64,${data[0]}`;
                    _self.askServer(_self.imgBase)
                    _self.img.src = _self.imgBase;
                  })
                }
              }
            ]
          })
          loginFailAlert.present();
        }).catch(err => {
          console.log(err)
        })
      } else if (data['user_id'] == 'null') {
        let loginFailAlert = this.promptAlert.create({
          title: '提示',
          message: "未检测到授权信息",
          buttons: [
            {
              text: '确认',
              handler: data => {
                console.log('detect failed');
              }
            },
            // {
            //   text: '确认',
            //   handler: tdata => {
            //     this.previewcamera.takePicture(this.pageWidth, this.pageWidth).then(data => {
            //       _self.imgBase = `data:image/jpeg;base64,${data[0]}`;
            //       _self.askServer(_self.imgBase)
            //       _self.img.src = _self.imgBase;
            //     })
            //   }
            // }
          ]
        })
        loginFailAlert.present();
      } else {
        _self.face_token = data['face_id']
        _self.user_id = data['user_id']
        _self.phoneNumber = data['phonenumber']
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
                if (data['phonenumber'] == _self.phoneNumber.slice(-4)) {
                  _self.isUser = true;
                  this.payPath = "zhifubao"
                  // _self.userservice.login(_self.face_token, _self.imgBase, null, _self.user_id, data.phonenumber)
                  this.JPush['setAlias']({ sequence: 1, alias: _self.user_id }).then((result) => {
                    console.log('alias', result)
                  }
                  ).catch(err => {
                    console.log(err)
                  })
                } else {
                  return false;
                }
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
  goToMyOrderPage(e) {
    console.log('dd')
    // this.navCtrl.push(OrderPage)
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
            let string = "15555555555"
            if (string.slice(-4) == '5555') {
              // _self.isUser = true;
              // _self.userservice.login(_self.face_token, _self.imgBase, null, _self.user_id, data.phonenumber)
              console.log(string)
            } else {
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }
  getTradeNumber() {
    let _self = this;
    // if (!this.userservice.userInfo.user_id) {
    //   alert('获取用户信息错误')
    //   return;
    // }
    // this.user_id='2088402239622912'

    console.log('user_id', this.user_id)
    return this.http.getTradeNumber(this.user_id).then((data: any) => {
      console.log(data.alipay_trade_create_response.trade_no)
      // _self.tradePay(data.alipay_trade_create_response.trade_no)
      _self.goPush(data.alipay_trade_create_response.trade_no)
    }
    ).catch(err => {
      console.log(err)
    })
  }
  goPush(tradeNumber) {
    console.log(tradeNumber)
    if (!this.user_id) {
      let loginSuccessAlert = this.promptAlert.create({
        title: '提示',
        message: "获取用户user_id错误",
        buttons: [
          {
            text: '确认',
            handler: data => {
              // console.log('detect failed');
            }
          }
        ]
      })
      loginSuccessAlert.present();
    }
    if (!tradeNumber) { return; }
    this.http.jpushPost(tradeNumber, this.user_id).then(data => {
      console.log(data)
      const prompt = this.promptAlert.create({
        title: '提示',
        message: "下单成功",
        buttons: [
          {
            text: '确认',
            handler: data => {

            }
          }
        ]
      });
      prompt.present();
    }, err => {
      console.log(err)
    });
  }
  pay(e) {
    console.log('gg', e)
    this.payPath = e;
    this.payPathChange();
  }
  payPathChange() {
    console.log(this.payPath);
    if (this.payPath == null) { return }
    if (this.payPath == "zhifubao") {
      // alert('支付包')
      if (this.user_id) {
        //alert('支付宝下单代扣成功')
        this.getTradeNumber()
      } else {
        this.qrcode(this.payPath);
      }
    } else {
      // alert("微信")
      if (this.open_id) {
        alert('支付宝下单代扣成功')
      } else {
        // this.qrcode(this.payPath); 
        alert('微信二维码授权')
      }
    }
  }
  qrcode(path) {
    console.log(this.face_token, this.phoneNumber);
    let dataText = null;
    if (path) {
      dataText = `http://neighbour.southeastasia.cloudapp.azure.com/Alipay/platform.html?face=${this.face_token}%26phone=${this.phoneNumber}%26uuid=${this.device.uuid}%26uuid=${this.payPath}`
    } else {
      dataText = `http://neighbour.southeastasia.cloudapp.azure.com/Alipay/platform.html?face=${this.face_token}%26phone=${this.phoneNumber}%26uuid=${this.device.uuid}`
    }
    // let redirectUrl=encodeURIComponent(`http://192.168.0.6:8080/Alipay/auth.html?face=${this.face_token}&phone=${this.phoneNumber}`)
    // console.log(encodeURIComponent(redirectUrl))
    // let dataText=`https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018062660475092%26scope=auth_user%26redirect_uri=${redirectUrl}`
    console.log(dataText)
    this.navCtrl.push(QRcodePage, { 'src': dataText, path: path })
  }
  payCancel(e) {
    console.log('payCancel', e)
    this.navCtrl.pop();
    // this.isUser=false;
  }
  ionViewWillLeave() {
    console.log('willleave')
    console.log(this.userservice.userInfo)
    // this.stopCameral();
    this.previewcamera.StopCameraPreview()
  }
}
