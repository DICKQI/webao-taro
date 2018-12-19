import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtMessage, AtAvatar, AtGrid, AtActionSheet, AtActionSheetItem} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import './dashboard.scss'
import './users.scss'
import logout from '../../static/logout.png'
import reset from '../../static/resetIcon.png'
import myJoin from '../../static/myjoin.png'
import manageUser from '../../static/manageUser.png'
import managePrice from '../../static/managePrice.png'
import manageActivity from '../../static/manageActivity.png'

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
      openedManagePrice: false
    }
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
      Taro.showToast({title: '加载中'});
      if (res.statusCode === 401) {
        Taro.showToast(res.data[0].error);
        this.setState({
          status: false
        });
        Taro.navigateTo({
          url: 'login'
        })
      } else if (res.statusCode === 200) {
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

  userAction = (item, index) => {
    switch (index) {
      case 0:
        save.MyLoginSessionID = '';
        save.MyID = '';
        Taro.reLaunch({
          url: '/pages/users/dashboard'
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
      <View className='line'>
        {
          this.state.status ?
            <View>
              <View className='userInfo'>
                <AtAvatar className='at-row__align-content--end' circle size={"large"}
                          image='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544496842193&di=bb5d519e49746f85df5e6c7921016f59&imgtype=0&src=http%3A%2F%2Fs9.rr.itc.cn%2Fr%2FwapChange%2F20171_18_16%2Fa9i5ff9624017280331.jpg'>
                </AtAvatar>
                <View style='margin: 1vh 0;'>欢迎{this.state.username}</View>
                <View style='margin: 2vh 0;'>用户组：{this.state.userRole}</View>
              </View>

              <View>
                <AtGrid onClick={this.userAction.bind(this)} hasBorder={false} data={
                  [
                    {
                      image: logout,
                      value: '登出'
                    },
                    {
                      image: reset,
                      value: '修改信息'
                    },
                    {
                      image: myJoin,
                      value: '参加的活动'
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
                          image: manageUser,
                          value: '管理用户'
                        },
                        {
                          image: managePrice,
                          value: '管理抽奖商品'
                        },
                        {
                          image: manageActivity,
                          value: '管理活动'
                        }
                      ]
                    }/>
                    <View style='margin-left:10px;margin-right: 10px'>
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
                style='text-align: center;display: flex;justify-content: center;flex-direction: column;align-items: center;'><View style='margin-bottom:3%'>你还未登录呢，还不能进行别的操作嚯</View>
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
