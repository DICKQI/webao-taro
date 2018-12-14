import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtInput, AtTextarea, AtMessage} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class addActivity extends Component {

  constructor() {
    super(...arguments);
    this.state = ({
      name: '',
      description:''
    })
  }

  setName(e) {
    this.setState({
      name: e
    })
  }
  setDescription(e) {
    console.log(e.target.value);
    this.setState({
      description:e.target.value
    })
  }

  addActivity() {
    Taro.request({
      url: 'http://www.r-share.cn:8080/webao_war/activity',
      method: "POST",
      data: {
        name: this.state.name
      },
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.navigateBack()
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
        <View className='userInfo'><AtInput title='活动名' name='name' onChange={this.setName.bind(this)} placeholder='请输入抽奖活动名'/> </View>
        <AtTextarea style='margin: 3vh 0;' value={this.state.description} onChange={this.setDescription.bind(this)} maxlength='200' placeholder='请输入抽奖描述'/>
        <AtButton type={"primary"} onClick={this.addActivity.bind(this)}>
          创建
        </AtButton>
        <AtMessage/>
      </View>
    )
  }
}
