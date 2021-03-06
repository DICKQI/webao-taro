import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage, AtCard, AtActionSheet, AtActionSheetItem, AtFloatLayout, AtModal, AtList, AtListItem} from 'taro-ui'
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
      role: false,
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
    if (mid === 28) {
      Taro.atMessage({
        'message': '你不能选择董科',
        'type': 'error'
      });
      return
    }
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
          id: res.data[0].id
        });
        if (res.data[0].role === 'ADMIN') {
          this.setState({
            role: true
          })
        } else {
          this.setState({
            role: false
          })
        }
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
        });
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

  toChangePage() {
    this.setState({
      checkUser: false
    });
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/manage',
      method: "PUT",
      data: {
        id: this.state.id,
        username: this.state.username,
        password: "123456"
      },
      header: {
        'Cookie': save.MyLoginSessionID,
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '重置成功',
          'type': 'success'
        });
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/account/list',
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              userList: res.data,
              checkUser: false
            })
          }
        })
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  changeAuthority(e) {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/manage',
      method: "POST",
      header: {
        'Cookie': save.MyLoginSessionID,
        'content-type': 'application/json'
      },
      data: {
        id: this.state.id,
        admin: e
      }
    }).then(res=>{
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '修改成功',
          'type': 'success'
        })
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/account/list',
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              userList: res.data,
              checkUser: false
            })
          }
        })
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
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
        <View style='text-align: center;color: gray;margin-top:1.5vh'>点击用户名查看当前用户信息</View>
        {
          this.state.userList.map((item, index) => {
            return <View key={index} onClick={this.checkId.bind(this, item.id)} className='margin'>
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
              onClick={this.toChangePage.bind(this)}>
              重置用户密码为123456
            </AtActionSheetItem>
            {
              this.state.role ? <AtActionSheetItem onClick={this.changeAuthority.bind(this, false)}>将用户降级为USERS</AtActionSheetItem>
                : <AtActionSheetItem onClick={this.changeAuthority.bind(this, true)}>将用户升级为ADMIN</AtActionSheetItem>
            }
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
              this.state.userActivityList.map((item, index) => {
                return <View key={index} style='margin: 3vh 0 1vh 2vh' onClick={this.toDetail.bind(this, item.id)}>
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
            <AtList>
            {
              this.state.userReward.map((item, index) => {
                return <View key={index}>
                  <AtListItem title={item.reward.name} extraText={item.exchange ? '已兑奖': '未兑奖'}/>
                </View>
              })
            }
            </AtList>
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
