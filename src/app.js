import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import index from './static/index.png'
import me from './static/me.png'
import UnSelectIndex from './static/unSelectIndex.png'
import UnSelectMe from './static/unSelectMe.png'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/users/dashboard',
      'pages/users/login',
      'pages/users/register',
      'pages/users/resetPassword',
      'pages/users/myActivity',
      'pages/users/listPrice',
      'pages/users/myReward',
      'pages/admin/admin',
      'pages/admin/managePrice/manage',
      'pages/admin/managePrice/addPrice',
      'pages/admin/managePrice/listPrice',
      'pages/admin/managePrice/changePrice',
      'pages/admin/manageActivity/addActivity',
      'pages/admin/manageActivity/ActivityList',
      'pages/admin/manageActivity/addReward',
      'pages/admin/manageActivity/editActivity',
      'pages/Activity/activityDetail',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#303030',
      navigationBarTitleText: 'webao',
      navigationBarTextStyle: 'white',
    },
    tabBar:{
      color: "#626567",
      selectedColor: "#2A8CE5",
      backgroundColor: "#FBFBFB",
      borderStyle: "white",
      fontSize:50,
      list:[
        {
          pagePath:'pages/index/index',
          text:'首页',
          iconPath: UnSelectIndex,
          selectedIconPath: index
        },
        {
          pagePath:'pages/users/dashboard',
          text:'我的',
          iconPath: UnSelectMe,
          selectedIconPath: me
        }
      ]
    }
  };
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index/>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
