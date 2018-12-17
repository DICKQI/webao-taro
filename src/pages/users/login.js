import Taro, {Component} from '@tarojs/taro'
import {View, Image} from "@tarojs/components"
import {AtButton, AtInput, AtMessage} from 'taro-ui'
import save from '../../config/loginSave'
import '../users/dashboard.scss'
import pig from '../../static/pig.jpeg'

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
        Taro.reLaunch({
          url: '/pages/users/dashboard'
        }).then(Taro.atMessage({
          'message': '登录成功',
          'type': 'success'
        }))
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
        <View className='userInfo'>
          <Image src={pig} />
          <View style='margin: 3vh 0;'>
            <AtInput title='用户名' name='username' type='text' onChange={this.setUsername.bind(this)}
                     value={this.state.username} placeholder='请输入用户名'/>
            <AtInput title='密码' name='password' type='password' onChange={this.setPassword.bind(this)}
                     value={this.state.password} placeholder='请输入密码'/>
          </View>
          <AtButton size={"small"} type={"primary"} formType="submit" onClick={this.login.bind(this)}
                    loading={this.state.loading}>登录</AtButton>
          <AtButton size={"small"} type={"secondary"} onClick={this.toRegister.bind(this)}>还没有账户，点击注册</AtButton>
          <AtMessage/>
        </View>
      </View>
    )
  }
}
