import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'

export default class manage extends Component {
  constructor() {
    super(...arguments)
  }

  toAdd() {
    Taro.navigateTo({
      url: '/pages/admin/managePrice/addPrice'
    })
  }
  toList() {
    Taro.navigateTo({
      url:'/pages/admin/managePrice/listPrice'
    })
  }


  render() {
    return (
      <View className='at-row'>
        <View className='at-col'>
          <AtButton type={"secondary"} onClick={this.toAdd.bind(this)}>新增商品</AtButton>
          <AtButton type={"secondary"} onClick={this.toList.bind(this)}>商品列表</AtButton>
        </View>
      </View>
    )
  }
}
