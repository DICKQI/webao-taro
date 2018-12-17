import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtNoticebar, AtMessage, AtCard, AtActionSheet, AtActionSheetItem} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../index/index.scss'

export default class admin extends Component {

  config = {
    navigationBarTitleText: '管理员'
  };

  constructor() {
    super(...arguments);
    this.state = {
      userList: [],
      checkUser: false,
      username: '',
      role: '',
      id: ''
    }
  }

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/list',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          userList: res.data
        })
      }
    })
  }

  checkId(mid) {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account',
      method: "GET",
      data: {
        id: mid
      },
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          checkUser: true,
          username: res.data[0].username,
          role: res.data[0].role,
          id: res.data[0].id
        })
      }
    })
  }

  deleteUser(mid) {
    if (save.MyID === mid) {
      Taro.atMessage({
        'message': '不能删除自己',
        'type': 'error'
      });
      return
    }
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/manage',
      method: "DELETE",
      data: {
        id: mid
      },
      header: {
        'Cookie': save.MyLoginSessionID,
        'content-type': 'application/json'
      },
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.reLaunch({
          url: '/pages/users/dashboard'
        }).then(
          Taro.atMessage({
            'message': '删除成功',
            'type': 'success'
          })
        )
      } else {
        Taro.showModal({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  toChangePage(id, username) {
    Taro.navigateTo({
      url: '/pages/admin/changeUser?id=' + id + '&username=' + username,
    })
  }

  cancelSheet() {
    this.setState({
      checkUser: false
    })
  }

  render() {
    return (
      <View className='at-article'>
        <AtNoticebar>点击用户名查看当前用户信息</AtNoticebar>
        {
          this.state.userList.map(item => {
            return <View onClick={this.checkId.bind(this, item.id)} className='margin'>
              <AtCard
                title={item.username}
              >
                <View className='at-row'>
                  <View className='at-col'>
                    用户名:{item.userInfo}
                  </View>
                  <View className='at-col'>
                    用户id:{item.id}
                  </View>
                  <View className='at-col'>
                    用户身份:{item.role}
                  </View>
                </View>
              </AtCard>
            </View>
          })
        }
        <View>
          <AtActionSheet isOpened={this.state.checkUser} cancelText={"取消"} onCancel={this.cancelSheet.bind(this)}>
            <AtActionSheetItem onClick={this.deleteUser.bind(this, this.state.id)}>
              删除该用户
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.toChangePage.bind(this, this.state.id, this.state.username)}>
              修改用户信息
            </AtActionSheetItem>
            <AtActionSheetItem>
              查看该用户的中奖情况
            </AtActionSheetItem>
            <AtActionSheetItem>
              查看该用户参加的抽奖
            </AtActionSheetItem>
          </AtActionSheet>
        </View>
        <AtMessage/>
      </View>
    )
  }
}
