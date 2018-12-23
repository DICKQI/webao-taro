import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtTextarea, AtMessage, AtInputNumber, AtFloatLayout} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class addReward extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      price: [],
      reward: [],
      rewardName: [],
      choose: false,
      id: '',
      number: 1,
      available: ''
    };
  }

  componentWillMount() {
    // 获取奖品列表 默认为只显示已启用的奖品
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize/list?all=0',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      this.setState({
        price: res.data
      })
    });
  }

  setReward() {
    this.state.rewardName.push(this.state.name + ":" + this.state.number);
    this.state.reward.push({
      id: this.state.id,
      number: this.state.number
    });
    this.setState({
      rewardName: this.state.rewardName,
      reward: this.state.reward,
      choose: false
    });
  }

  setNumber(e) {
    this.setState({
      number: e
    })
  }

  openFloat(id, name, available) {
    console.log(id, name, available);
    this.setState({
      id: id,
      name: name,
      available: available,
      choose: true
    })
  }


  addReward() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/manage',
      method: "POST",
      data: {
        acid: this.$router.params.id,
        data: this.state.reward
      },
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '添加成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
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
      <View style='color:gray;margin-top:10vh'>
        <View style='text-align:center;'>当前已选中的商品及其数量</View>
        <View style='margin-left: 2vh;margin-right: 2vh'>
          <AtTextarea count={false} value={this.state.rewardName} disabled={true}/>
        </View>
        <View className='userInfo'>
          <View style='margin-top:3vh'>点击奖品名后可以添加</View>
          {

            this.state.price.map((item, index) => {
              return <View key={index} onClick={this.openFloat.bind(this, item.id, item.name, item.available)}
                           style='margin: 1vh 0'>
                奖品名：{item.name} 可用数量：{item.available}
              </View>
            })
          }
          <AtButton type={"primary"} size={"small"} onClick={this.addReward.bind(this)}>确认添加</AtButton>
        </View>
        <AtFloatLayout title='请选择数量' isOpened={this.state.choose}>
          <View className='userInfo' style='margin: 3vh 3vh'>
            <AtInputNumber type={"number"} max={this.state.available} min={1} step={1} value={this.state.number}
                           onChange={this.setNumber.bind(this)}/>
          </View>
          <AtButton onClick={this.setReward.bind(this)}>确认</AtButton>
        </AtFloatLayout>
        <AtMessage/>
      </View>
    );
  }

}
