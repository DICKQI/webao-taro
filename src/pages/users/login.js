import Taro, {Component} from '@tarojs/taro'
import {View, Image} from "@tarojs/components"
import {AtButton, AtInput, AtMessage, AtGrid, AtDivider} from 'taro-ui'
import save from '../../config/loginSave'
import '../users/dashboard.scss'
import pig from '../../static/WEIAO.png'
import wechat from '../../static/wechat.png'
import qq from '../../static/qq.png'
import weibo from '../../static/weibo.png'

export default class MyLogin extends Component {
  config = {
    navigationBarTitleText: '登录'
  };

  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      password: '',
      errorMsg: '',
      loading: false
    }
  }

  setUsername(e) {
    this.setState({
      username: e
    })
  };

  setPassword(e) {
    this.setState({
      password: e
    })
  }

  login() {
    this.setState({
      loading: true
    });
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/login',
      method: "POST",
      data: {
        'username': this.state.username,
        'password': this.state.password
      },
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {

        save.MyLoginSessionID = res.header['Set-Cookie'];
        save.MyID = res.data[0].id;
        Taro.atMessage({
          "message": '登录成功',
          "type": 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/users/dashboard'
          })
        }, 1500)
      } else {
        this.setState({
          loading: false
        });
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        });
      }
    })
  };

  toRegister() {
    Taro.navigateTo({url: 'register'})
  }

  render() {
    return (

      <View>
        <View style='display: flex;justify-content: center;align-items: center;flex-direction: column;'>
          <View style='margin-top: 3vh'>
            <Image mode={"widthFix"} src={pig} style='width: 25vh; height:25vh'/>
          </View>
          <View style='margin: 10vh 0;'>
            <AtInput title='用户名' name='username' type='text' onChange={this.setUsername.bind(this)}
                     value={this.state.username} placeholder='请输入用户名'/>
            <AtInput title='密码' name='password' type='password' onChange={this.setPassword.bind(this)}
                     value={this.state.password} placeholder='请输入密码'/>
          </View>
        </View>
        <View style='display: flex;justify-content: center;align-items: center;' className='at-row'>
          <View className='at-col'>
            <AtButton type={"primary"} formType="submit" onClick={this.login.bind(this)}
                      loading={this.state.loading}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;登录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</AtButton>
          </View>
          <View className='at-col' style='margin-left: 3vh'>
            <AtButton type={"secondary"} onClick={this.toRegister.bind(this)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注册&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</AtButton>
          </View>
        </View>

        <View style='margin-top: 8vh'>
          <AtDivider customStyle='height: 60%' content='第三方登录' fontSize={27} fontColor={'#949494'}/>
          <AtGrid data={
            [
              {
                image: wechat,
                value: '微信'
              },
              {
                image: qq,
                value: 'QQ'
              },
              {
                image: weibo,
                value: '微博'
              }
            ]
          }
                  hasBorder={false}/>
        </View>
        <AtMessage/>

      </View>
    )
  }
}
