import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtForm, AtButton, AtInput, AtMessage, AtDivider, AtGrid} from 'taro-ui'
import save from '../../config/loginSave'
import '../users/dashboard.scss'
import wechat from "../../static/wechat.png";
import qq from "../../static/qq.png";
import weibo from "../../static/weibo.png";

export default class register extends Component {
  config = {
    navigationBarTitleText: '注册'
  };

  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      password: ''
    }
  }

  setUsername(e) {
    this.setState({
      username: e
    })
  }

  setPassword(e) {
    this.setState({
      password: e
    })
  }

  register() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/register',
      method: "POST",
      data: {
        username: this.state.username,
        password: this.state.password
      },
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {
        save.MyLoginSessionID = res.header['Set-Cookie'];
        save.MyID = res.data[0].id;
        Taro.reLaunch({
          url: '/pages/users/dashboard'
        }).then(Taro.atMessage({
          'message': '注册成功,自动登录',
          'type': 'success'
        }))
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  render() {
    return (
      <View>
        <View className='userInfo' style='margin-top: 25%;'>
          <View style='text-align:center;margin-bottom: 3vh;'>欢迎加入我们的世界</View>
          <AtInput title='用户名' name='username' placeholder='请输入用户名' value={this.state.username}
                   onChange={this.setUsername.bind(this)}/>
          <AtInput title='密码' name='password' type='password' placeholder='请输入密码' value={this.state.password}
                   onChange={this.setPassword.bind(this)}/>
        </View>
        <View style='display: flex;justify-content: center;align-items: center;margin-top:3vh'>
          <AtButton type={"primary"} formType='submit' onClick={this.register.bind(this)}>注册</AtButton>
        </View>
        <View style='margin-top: 28vh'>
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
