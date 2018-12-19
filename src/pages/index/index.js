import Taro, {Component} from '@tarojs/taro'
import {View, Image, Swiper, SwiperItem} from '@tarojs/components'
import {AtGrid, AtSearchBar, AtDivider, AtCard, AtNoticebar} from 'taro-ui'
import './index.scss'
import img1 from '../../static/1.jpeg'
import img2 from '../../static/2.jpeg'
import save from "../../config/loginSave";


export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      activity: [],
      searchValue: '',
      userList: [],
      luckyDog: {}
    }
  }

  setSearchValue(e) {
    this.setState({
      searchValue: e
    })
  }

  componentWillMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/list'
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activity: res.data
        });
      }
    });
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/list',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      this.setState({
        luckyDog: {
          username: '121',
          reward: 'java高级编程教材一本'
        }
      });
      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.length; i++) {
          this.state.userList.push(res.data[i].id);
          this.setState({
            userList: this.state.userList
          })
        }
        setInterval(() => {
          var index = Math.floor(Math.random() * (res.data.length - 1 + 1));
          var id = res.data[index].id;
          Taro.request({
            url: 'https://www.r-share.cn/webao_war/account/prizeRecord?account_id=' + id,
            header: {
              'Cookie': save.MyLoginSessionID
            }
          }).then(luck => {
            if (luck.statusCode === 200) {
              var priceIndex = Math.floor(Math.random() * (luck.data.length - 1 + 1));
              Taro.request({
                url: 'https://www.r-share.cn/webao_war/account?id=' + id,
                header: {
                  'Cookie': save.MyLoginSessionID
                }
              }).then(luckU => {
                if (luckU.statusCode === 200) {
                  this.setState({
                    luckyDog: {
                      username: luckU.data[0].username,
                      reward: luck.data[priceIndex].reward.name
                    }
                  })
                }
              })
            }
          })
        }, 6000)
      }
    })
  }


  toAcDetail(mid) {
    Taro.navigateTo({
      url: '/pages/Activity/activityDetail?id=' + mid
    })
  }

  config = {
    navigationBarTitleText: '首页'
  };

  render() {
    return (
      <View>
        <AtSearchBar value={this.state.searchValue} onChange={this.setSearchValue.bind(this)}/>
        <AtNoticebar marquee icon='volume-plus'>恭喜{this.state.luckyDog.username}获得{this.state.luckyDog.reward}</AtNoticebar>
        <View style='text-align: center;'>
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            vertical={false}
            indicatorDots={false}
            skipHiddenItemLayout
            autoplay>
            <SwiperItem>
              <View><Image mode={"widthFix"} src={img1}/></View>
            </SwiperItem>
            <SwiperItem>
              <View><Image mode={"widthFix"} src={img2}/></View>
            </SwiperItem>
          </Swiper>
        </View>
        <View style='margin-top: 2%'>
          <AtGrid mode='rect' data={
            [
              {
                image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                value: '抽奖中心'
              },
              {
                image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                value: '折扣中心'
              },
              {
                image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                value: '领会员'
              },
              {
                image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                value: '新品首发'
              },
              {
                image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                value: '领积分'
              },
              {
                image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                value: '积分商城'
              }
            ]
          }
                  hasBorder={true}
          />
        </View>
        <View className='more'>更多活动</View>
        {
          this.state.activity.map(item => {
            return <View className='margin'>
              <AtCard onClick={this.toAcDetail.bind(this, item.id)} title={item.name + (item.lottery ? '(已开奖)' : '')}
                      extra={'发起人：' + item.author.username}>
                抽奖详情：。。。。。。
              </AtCard>
            </View>
          })
        }
        <AtDivider content='没有更多了'/>
      </View>
    )
  }
}


