import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtForm, AtButton, AtInput, AtMessage} from 'taro-ui'
import save from '../../config/loginSave'

export default class resetPassword extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      oldPassword: '',
      newPassword: '',
      id: '',
    }
  }

  config = {
    navigationBarTitleText: '修改我的信息'
  };

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account',
      data: {
        id: save.MyID
      },
      header: {
        'Cookie': save.MyLoginSessionID,
      },
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          username: res.data[0].username
        })
      }
    })
  }

  setUsername(e) {
    this.setState({
      username: e
    })
  }

  setOldPassword(e) {
    this.setState({
      oldPassword: e
    })
  }

  setNewPassword(e) {
    this.setState({
      newPassword: e
    })
  }

  rePassword() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account',
      method: "PUT",
      data: {
        username: this.state.username,
        old_password: this.state.oldPassword,
        new_password: this.state.newPassword
      },
      header: {
        'Cookie': save.MyLoginSessionID,
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {
        save.MyID = '';
        save.MyLoginSessionID = '';
        Taro.reLaunch({
          url: '/pages/users/login'
        }).then(Taro.atMessage({
          'message': '修改成功，请重新登录',
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
      <View style='text-align: center;display: flex;justify-content: center;flex-direction: column;align-items: center;margin: 3vh 0;'>
        <AtInput title='用户名' type='text' name='username' onChange={this.setUsername.bind(this)}
                 value={this.state.username}/>
        <AtInput title='旧密码' type='password' name='oldPassword' onChange={this.setOldPassword.bind(this)}
                 value={this.state.oldPassword} placeholder='必填'/>
        <AtInput title='新密码' type='password' name='newPassword' onChange={this.setNewPassword.bind(this)}
                 value={this.state.newPassword} placeholder='必填'/>
        <AtButton type={"primary"} formType='submit' onClick={this.rePassword.bind(this)}>提交</AtButton>
        <AtMessage/>
      </View>
    )
  }
}
