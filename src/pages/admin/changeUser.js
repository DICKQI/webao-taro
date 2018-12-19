import Taro, {Component} from '@tarojs/taro'
import {View, Picker} from '@tarojs/components'
import {AtButton, AtInput, AtMessage} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../users/dashboard.scss'

export default class changeUser extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: '',
      username: '',
      newPassword: '',
      role: '',
      roleSelect: ['ADMIN', 'USER'],
      admin: false
    }
  }

  componentWillMount() {
    this.setState({
      id: this.$router.params.id,
      username: this.$router.params.username,
      role: this.$router.params.role
    });
  }

  setRole(role) {
    if (role.detail.value === '0') {
      this.setState({
        role: 'ADMIN',
        admin: true
      })
    } else if (role.detail.value === '1') {
      this.setState({
        role: 'USER',
        admin: false
      })
    }
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
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/account/manage',
          method: "POST",
          header: {
            'Cookie': save.MyLoginSessionID,
            'content-type': 'application/json'
          },
          data: {
            id: this.state.id,
            admin: this.state.admin
          }
        }).then(res => {
            if (res.statusCode === 200) {
              Taro.atMessage({
                'message': '修改成功',
                'type': 'success'
              });
              setTimeout(() => {
                Taro.reLaunch({
                  url:'/pages/users/dashboard'
                })
              }, 1500)
            } else {
              Taro.atMessage({
                'message': res.data[0].msg,
                'type': 'error'
              })
            }
          }
        )
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
      <View className='userInfo'>
        <AtInput title='用户名' name='username' onChange={this.setUsername.bind(this)} value={this.state.username}/>
        <AtInput title='密码' name='newPassword' type='password' onChange={this.setPassword.bind(this)} value={this.state.password}/>

        <Picker mode='selector' value={this.state.role} onChange={this.setRole.bind(this)}
                range={this.state.roleSelect}>
          <View className='picker'>
            当前选择用户组：{this.state.role}
          </View>
        </Picker>
        <AtButton type={"secondary"} size={"small"} formType='submit'
                  onClick={this.changeUserInfo.bind(this)}>提交</AtButton>
        <AtMessage/>
      </View>
    )
  }
}
