import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtInput, AtForm, AtMessage} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'

export default class changeUser extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: '',
      username: '',
      newPassword: '',
    }
  }

  componentWillMount() {
    this.setState({
      id: this.$router.params.id,
      username: this.$router.params.username
    });
  }



  setUsername(e) {
    this.setState({
      username: e
    })
  }

  setPassword(e) {
    this.setState({
      newPassword: e
    })
  }

  changeUserInfo() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/manage',
      method: "PUT",
      data: {
        id: this.state.id,
        username: this.state.username,
        password: this.state.newPassword
      },
      header: {
        'Cookie': save.MyLoginSessionID,
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.navigateBack().then(Taro.atMessage({
          'message': '修改成功',
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
        <AtInput title='用户名' name='username' onChange={this.setUsername.bind(this)} value={this.state.username}/>
        <AtInput title='密码' name='newPassword' onChange={this.setPassword.bind(this)} value={this.state.password}/>
        <AtButton type={"secondary"} formType='submit' onClick={this.changeUserInfo.bind}>提交</AtButton>
        <AtMessage/>
      </View>
    )
  }
}
