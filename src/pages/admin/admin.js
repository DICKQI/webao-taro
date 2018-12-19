import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtMessage, AtCard, AtActionSheet, AtActionSheetItem, AtFloatLayout, AtModal} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../index/index.scss'
import '../users/dashboard.scss'

export default class admin extends Component {

  config = {
    navigationBarTitleText: '管理员'
  };

  constructor() {
    super(...arguments);
    this.state = {
      userList: [],
      checkUser: false,
      checkUserActivity: false,
      username: '',
      role: '',
      id: '',
      userActivityList: [],
      checkUserReward: false,
      userReward: [],

      sureDeleteUser: false
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

  sureDelete() {
    this.setState({
      sureDeleteUser: true,
      checkUser: false
    })
  }

  cancelDelete() {
    this.setState({
      sureDeleteUser: false
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
        Taro.atMessage({
          'message': '删除成功',
          'type': 'success'
        });
        this.setState({
          sureDeleteUser: false
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/users/dashboard'
          })
        }, 1500)
      } else {
        Taro.showModal({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  UserActivity(mid) {
    this.setState({
      checkUser: false,
      checkUserActivity: true
    });
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/activity?id=' + mid,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          userActivityList: res.data
        })
      }
    })
  }

  toChangePage(id, username, role) {
    this.setState({
      checkUser: false
    });
    Taro.navigateTo({
      url: '/pages/admin/changeUser?id=' + id + '&username=' + username + '&role=' + role,
    })
  }

  cancelSheet() {
    this.setState({
      checkUser: false,
    })
  }

  closeFloatLayout() {
    this.setState({
      checkUserActivity: false,
      checkUserReward: false
    })
  }

  toDetail(mid) {
    this.setState({
      checkUserActivity: false
    });
    Taro.navigateTo({
      url: '/pages/Activity/activityDetail?id=' + mid
    })
  }


  userReward(mid) {
    this.setState({
      checkUser: false,
      checkUserReward: true
    });
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/prizeRecord?account_id=' + mid,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          userReward: res.data
        })
      }
    })
  }


  render() {
    return (
      <View className='at-article'>
        <Text className='userInfo'>点击用户名查看当前用户信息</Text>
        {
          this.state.userList.map(item => {
            return <View onClick={this.checkId.bind(this, item.id)} className='margin'>
              <AtCard
                title={item.username}
              >
                <View className='at-row'>
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
            <AtActionSheetItem onClick={this.sureDelete.bind(this)}>
              删除该用户
            </AtActionSheetItem>
            <AtActionSheetItem
              onClick={this.toChangePage.bind(this, this.state.id, this.state.username, this.state.role)}>
              修改用户信息
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.UserActivity.bind(this, this.state.id)}>
              查看该用户参加的抽奖
            </AtActionSheetItem>
            <AtActionSheetItem onClick={this.userReward.bind(this, this.state.id)}>
              查看该用户的中奖情况
            </AtActionSheetItem>
          </AtActionSheet>
        </View>
        <View>
          <AtFloatLayout isOpened={this.state.checkUserActivity} title={this.state.username}
                         onClose={this.closeFloatLayout.bind(this)}>
            {
              this.state.userActivityList.map(item => {
                return <View style='margin: 3vh 0 2vh 2vh' onClick={this.toDetail.bind(this, item.id)}>
                  <AtCard title={item.name}>
                    {item.description}
                  </AtCard>
                </View>
              })
            }
          </AtFloatLayout>
        </View>
        <View>
          <AtFloatLayout isOpened={this.state.checkUserReward} title={this.state.username}
                         onClose={this.closeFloatLayout.bind(this)}>
            {
              this.state.userReward.map(item => {
                return <View className='userInfo' style='margin-top: 3vh;color:red'>
                  {item.reward.name}
                  {
                    item.exchange ? '~已兑奖~' : '~未兑奖~'
                  }
                </View>
              })
            }
          </AtFloatLayout>
        </View>
        <AtModal title='请谨慎操作' content={'你确定要删除' + this.state.username + '吗？'} isOpened={this.state.sureDeleteUser}
                 onConfirm={this.deleteUser.bind(this, this.state.id)} onCancel={this.cancelDelete.bind(this)}
                 confirmText='确认删除' cancelText='取消'/>
          <AtMessage/>
      </View>
  )
  }
  }
