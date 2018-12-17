import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtForm, AtButton, AtInput, AtMessage} from 'taro-ui'
import save from '../../config/loginSave'

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
        <AtInput title='用户名' name='username' type='number' placeholder='请输入用户名' value={this.state.user}
                 onChange={this.setUsername.bind(this)}/>
        <AtInput title='密码' name='password' type='password' placeholder='请输入密码' value={this.state.password}
                 onChange={this.setPassword.bind(this)}/>
        <AtButton type={"primary"} formType='submit' onClick={this.register.bind(this)}>注册</AtButton>
        <AtMessage/>
      </View>
    )
  }
}
