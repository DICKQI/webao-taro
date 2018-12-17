import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtMessage, AtAvatar, AtGrid, AtCard, AtNavBar, AtNoticebar, AtFloatLayout} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class ActivityList extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      activityList: [],
      activityDetail: '',
      activityId: '',
      activityName: '',
      p_number: '',
      reward: [],
      choose: false
    }
  }

  config = {
    navigationBarTitleText: '检索所有的抽奖活动'
  };

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/list',
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activityList: res.data
        });
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    });
  }

  openFloat(name, id) {

    this.setState({
      activityName: name,
      activityId: id,
      choose: true
    });

    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity?id=' + id,
      header: {
        'Cookie': save.MyLoginSessionID
      },
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activityDetail: res.data[0].description,
          reward: res.data[0].reward,
          p_number: res.data[0].p_number
        })
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  closeFloat() {
    this.setState({
      choose: false
    })
  }


  render() {
    return (
      <View>
        {
          this.state.activityList.map(item => {
            return <View style='margin: 3vh 0;'>
              <AtCard onClick={this.openFloat.bind(this, item.name, item.id)} title={item.name}
                      extra={item.author.username}>
                抽奖详情：。。。。。。
              </AtCard>
            </View>
          })
        }
        <AtFloatLayout title={this.state.activityName} isOpened={this.state.choose}
                       onClose={this.closeFloat.bind(this)}>
          <AtCard title='本次活动的奖品们'>
            {
              this.state.reward.map(item => {
                return <View className='at-article__p'>
                  <View>奖品名：{item.reward.name}</View>
                  <View>数量：{item.number}</View>
                </View>
              })
            }
          </AtCard>
          <View className='at-article__h3'>抽奖详情</View>
          <View className='at-article__p'>{this.state.activityDetail}</View>
          <View className='userInfo'>
            当前参与人数：{this.state.p_number}
          </View>
        </AtFloatLayout>
      </View>
    );
  }


}
