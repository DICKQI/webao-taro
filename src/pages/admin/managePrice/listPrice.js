import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtMessage, AtRate} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../index/index.scss'

export default class listPrice extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      priceList: [],
      check: false,
      id: '',
      name: '',
      stock: '',
      grade: '',
      is_use: false,
      available: '',

    }
  }

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize/list',
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
          stock: res.data[0].stock,
          grade: res.data[0].grade,
          is_use: res.data[0].is_use,
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

  deletePrice(mid) {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize?id=' + mid,
      method: "DELETE",
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.reLaunch({
          url: '/pages/admin/managePrice/listPrice'
        }).then(
          Taro.atMessage({
            'message': '删除成功',
            'type': 'success'
          })
        )
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }
  toChange(mid) {
    Taro.navigateTo({
      url:'/pages/admin/managePrice/changePrice?id=' + mid
    })
  }
  render() {
    return (
      <View>
        {
          this.state.priceList.map(item => {
            return <View style='margin: 3vh 0;'><AtButton type={"secondary"} onClick={this.checkPrice.bind(this, item.id)}> {item.name}</AtButton></View>
          })
        }
        {
          this.state.check ? <View>
            <View className='toCenter'>
              <View>{this.state.name}</View>
              <View>库存量：{this.state.stock}</View>
              <View>
                <View>等级:{this.state.grade}级</View>
                <AtRate
                  value={this.state.grade}
                />
              </View>
              <View>是否启用：{this.state.is_use}</View>
              <View>可用库存数：{this.state.available}</View>
            </View>
            <View className='at-row'>
              <View className='at-col'>
                <AtButton type={"secondary"} onClick={this.deletePrice.bind(this, this.state.id )}>删除该奖品</AtButton>
              </View>
              <View className='at-col'>
                <AtButton type={"secondary"} onClick={this.toChange.bind(this, this.state.id)}>修改这个商品</AtButton>
              </View>
            </View>
          </View> : ''
        }
        <AtMessage/>
      </View>
    );
  }
}
