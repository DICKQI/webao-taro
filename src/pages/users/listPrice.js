import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtFloatLayout, AtMessage, AtRate, AtList, AtListItem} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../users/dashboard.scss'
import '../index/index.scss'

export default class listPrice extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      priceList: [],
      check: false,
      id: '',
      name: '',
      grade: '',
      available: '',
    }
  }

  config = {
    navigationBarTitleText: '查看所有的可用奖品'
  };

  checkPrice(mid) {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize',
      data: {
        id: mid
      },
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          check: true,
          id: res.data[0].id,
          name: res.data[0].name,
          grade: res.data[0].grade,
          available: res.data[0].available
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
      check: false
    })
  }


  componentWillMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize/list?all=0',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          priceList: res.data
        })
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
        <AtList>
          {
            this.state.priceList.map((item, index) => {
              return <View key={index}>
                <AtListItem thumb='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/rewardIcon.png'
                            onClick={this.checkPrice.bind(this, item.id)} title={item.name} arrow={"right"}/>
              </View>
            })
          }
        </AtList>
        <AtFloatLayout title='详情' isOpened={this.state.check} onClose={this.closeFloat.bind(this)}>
          <View className='toCenter' style='margin-top: 5vh;font-size: 20px;'>
            <View>{this.state.name}</View>
            <View>
              <View>等级:{this.state.grade}级</View>
              <AtRate
                value={this.state.grade}
              />
            </View>
            <View>可用库存数：{this.state.available}</View>
          </View>
        </AtFloatLayout>
        <AtMessage/>
      </View>
    );
  }

}
