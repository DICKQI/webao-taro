import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {AtButton, AtAvatar, AtGrid, AtCurtain, AtActionSheet, AtActionSheetItem, AtModal} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import './dashboard.scss'
import './users.scss'
import error from '../../static/error.png'

export default class dashboard extends Component {
  config = {
    navigationBarTitleText: '我的'
  };

  constructor() {
    super(...arguments);
    this.state = {
      username: '',
      status: false,
      userRole: '',
      isAdmin: false,
      openedManagePrice: false,
      openCurtain: false,
      lzlCurtain: false,

      exitCheck: false
    }
  }

  closeCurtain() {
    this.setState({
      openCurtain: false,
      lzlCurtain: true
    })
  }

  closeLZLCurtain() {
    this.setState({
      lzlCurtain: false,
    })
  }


  componentWillMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account',
      method: "GET",
      data: {
        id: save.MyID
      },
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 401) {
        Taro.showToast({
          title: res.data[0].msg,
          image: error
        });
        setTimeout(() => {
          this.setState({
            status: false
          });
          Taro.navigateTo({
            url: 'login'
          })
        }, 1200)
      } else if (res.statusCode === 200) {
        Taro.showToast({
          title: '加载成功'
        });
        this.setState({
          status: true,
          username: res.data[0].username,
          userRole: res.data[0].role
        });
        if (res.data[0].role === 'ADMIN') {
          this.setState({
            isAdmin: true
          });
        }
      }
    })
  }

  jumpToLogin() {
    Taro.navigateTo({
      url: 'login'
    })
  }

  toAdd() {
    this.setState({
      openedManagePrice: false
    });
    Taro.navigateTo({
      url: '/pages/admin/managePrice/addPrice'
    })
  }

  toList() {
    this.setState({
      openedManagePrice: false
    });
    Taro.navigateTo({
      url: '/pages/admin/managePrice/listPrice'
    })
  }

  sheetCancel() {
    this.setState({
      openedManagePrice: false
    })
  }

  logout() {
    save.MyLoginSessionID = '';
    save.MyID = '';
    this.setState({
      exitCheck: false
    });
    Taro.reLaunch({
      url: '/pages/users/dashboard'
    });
  }

  closeMyModal() {
    this.setState({
      exitCheck: false
    })
  }

  userAction = (item, index) => {
    switch (index) {
      case 0:
        this.setState({
          exitCheck: true
        });
        break;
      case 1:
        Taro.navigateTo({
          url: 'resetPassword'
        });
        break;
      case 2:
        Taro.navigateTo({
          url: '/pages/users/myActivity'
        });
        break;
      case 3:
        Taro.navigateTo({
          url: '/pages/users/listPrice'
        });
        break;
      case 4:
        Taro.navigateTo({
          url: '/pages/users/myReward'
        });
        break;
      case 5:
        this.setState({
          openCurtain: true
        });
        break;
    }
  };
  priceAction = (item, index) => {
    switch (index) {
      case 0:
        Taro.navigateTo({
          url: '/pages/admin/admin'
        });
        break;
      case 1:
        this.setState({
          openedManagePrice: true
        });
        break;
      case 2:
        Taro.navigateTo({
          url: '/pages/admin/manageActivity/ActivityList'
        })
    }
  };


  newActivity() {
    Taro.navigateTo({
      url: '/pages/admin/manageActivity/addActivity'
    })
  }

  render() {
    return (
      <View>
        <AtModal content='确定要离开吗？' isOpened={this.state.exitCheck} confirmText='确定' cancelText='留下来'
                 onConfirm={this.logout.bind(this)}
                 onClose={this.closeMyModal.bind(this)} onCancel={this.closeMyModal.bind(this)}/>
        {
          this.state.status ?
            <View>
              <AtCurtain isOpened={this.state.openCurtain} onClose={this.closeCurtain.bind(this)}>
                <Image src='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/image/payment.jpeg' mode={"widthFix"}
                       style='width: 80%;height:80%;margin-left: 5vh'/>
              </AtCurtain>
              <AtCurtain isOpened={this.state.lzlCurtain} onClose={this.closeLZLCurtain.bind(this)}>
                <Image src='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/image/payment2.jpeg' mode={"widthFix"}
                       style='width: 80%;height:80%;margin-left: 5vh'/>
              </AtCurtain>
              <View className='userInfo'>
                <View style='margin-top: 1vh'>
                  <AtAvatar className='at-row__align-content--end' circle size={"large"}
                            image='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/head.jpeg'>
                  </AtAvatar>
                </View>
                <View style='margin-top: 1vh;'>欢迎 {this.state.username}</View>
                <View style='margin-top: 1vh;'>用户组：{this.state.userRole}</View>
              </View>

              <View>
                <AtGrid onClick={this.userAction.bind(this)} hasBorder={false} data={
                  [
                    {
                      image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/logout.png',
                      value: '登出'
                    },
                    {
                      image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/resetIcon.png',
                      value: '修改信息'
                    },
                    {
                      image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/myjoin.png',
                      value: '参加的活动'
                    },
                    {
                      image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/myPrice.png',
                      value: '查看所有奖品'
                    },
                    {
                      image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/myReward.png',
                      value: '中奖纪录',
                    },
                    {
                      image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/money.png',
                      value: '向开发者捐赠'
                    }
                  ]
                }/>
              </View>
              {
                this.state.isAdmin ?
                  <View>
                    <AtGrid onClick={this.priceAction.bind(this)} hasBorder={false} data={
                      [
                        {
                          image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/manageUser.png',
                          value: '管理用户'
                        },
                        {
                          image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/managePrice.png',
                          value: '管理抽奖商品'
                        },
                        {
                          image: 'https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/manageActivity.png',
                          value: '管理活动'
                        }
                      ]
                    }/>
                    <View style='margin-left:10px;margin-right: 10px;margin-bottom:3vh;'>
                      <AtButton type='primary' onClick={this.newActivity.bind(this)}>
                        发起抽奖
                      </AtButton>
                    </View>
                  </View>
                  :
                  ''
              }
            </View>
            :

            <View style='margin-top: 50%;color:dodgerblue'>
              <View
                style='text-align: center;display: flex;justify-content: center;flex-direction: column;align-items: center;'><View
                style='margin-bottom:3%'>你还未登录呢，还不能进行别的操作嚯</View>
                <AtButton size={"small"} type={"primary"}
                          onClick={this.jumpToLogin.bind(this)}>点击我进入登录界面吧</AtButton>
              </View>
            </View>
        }
        <AtMessage/>
        <AtActionSheet isOpened={this.state.openedManagePrice} cancelText='取消' onCancel={this.sheetCancel.bind(this)}>
          <AtActionSheetItem onClick={this.toAdd.bind(this)}>
            新增奖品
          </AtActionSheetItem>
          <AtActionSheetItem onClick={this.toList.bind(this)}>
            奖品列表
          </AtActionSheetItem>
        </AtActionSheet>
      </View>

    )
  }
}
