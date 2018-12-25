import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage, AtTabs, AtTabsPane, AtCard} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import './dashboard.scss'
import './users.scss'

export default class myActivity extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      activity: [],
      lotteryActivity: [],
      noneLotteryActivity: [],
      lotteryEmpty: true,
      noneLotteryEmpty: true,
      current: 0
    }
  }

  config = {
    navigationBarTitleText: '我参加的活动'
  };

  componentWillMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/activity?id=' + save.MyID,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        if (JSON.stringify(res.data) === '[]') {
          this.setState({
            lotteryEmpty: true,
            noneLotteryEmpty: true
          })
        } else {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].lottery === true) {
              this.state.lotteryActivity.push(res.data[i]);
              this.setState({
                lotteryEmpty: false,
                lotteryActivity: this.state.lotteryActivity
              })
            } else {
              this.state.noneLotteryActivity.push(res.data[i]);
              this.setState({
                noneLotteryEmpty: false,
                noneLotteryActivity: this.state.noneLotteryActivity
              })
            }
          }
        }
      }
    })
  }

  toDetail(mid) {
    Taro.navigateTo({
      url: '/pages/Activity/activityDetail?id=' + mid
    })
  }

  switchTabs(value) {
    this.setState({
      current: value
    })
  }

  render() {
    const tabList = [
      {
        title: '未开奖'
      },
      {
        title: '已开奖'
      }
    ];
    return (
      <View>
        {
          this.state.empty ?
            <View style='text-align: center;color:gray;font-size: 20px;margin-top: 70%'>
              你还没有参加任何活动呢，快去参加吧
            </View>
            : this.state.activity.map((item, index) => {
              return <View key={index} style='margin: 3vh 3%'>
                <AtCard onClick={this.toDetail.bind(this, item.id)} title={item.name}>
                  {item.description}
                </AtCard>
              </View>
            })

        }
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.switchTabs.bind(this)}>
          <AtTabsPane current={this.state.current} index={0}>
            {
              this.state.noneLotteryEmpty ?
                <View style='text-align: center;color:gray;font-size: 20px;margin-top: 70%'>
                  这里没有任何活动呢~
                </View> :
                this.state.noneLotteryActivity.map((item, index) => {
                  return <View key={index} style='margin: 3vh 3%'>
                    <AtCard onClick={this.toDetail.bind(this, item.id)} title={item.name}>
                      {item.description}
                    </AtCard>
                  </View>
                })
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {
              this.state.lotteryEmpty ?
                <View style='text-align: center;color:gray;font-size: 20px;margin-top: 70%'>
                  这里没有任何活动呢~
                </View> :
                this.state.lotteryActivity.map((item, index) => {
                  return <View key={index} style='margin: 3vh 3%'>
                    <AtCard onClick={this.toDetail.bind(this, item.id)} title={item.name}>
                      {item.description}
                    </AtCard>
                  </View>
                })
            }
          </AtTabsPane>
        </AtTabs>
        <AtMessage/>
      </View>
    );
  }

}
