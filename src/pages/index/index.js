import Taro, {Component} from '@tarojs/taro'
import {View, Image, Swiper, SwiperItem} from '@tarojs/components'
import {AtGrid, AtSearchBar, AtDivider, AtCard, AtNoticebar, AtModal, AtTabs, AtTabsPane} from 'taro-ui'
import './index.scss'
import save from "../../config/loginSave";

var flashTimer;

export default class Index extends Component {


  constructor() {
    super(...arguments);
    this.state = {
      searchValue: '',
      userList: [],
      luckyDog: {},
      openModal: false,
      lotteryActivity: [],
      noneLotteryActivity: [],
      current: 0
    }
  }

  switchTabs(value) {
    this.setState({
      current: value
    })
  }

  click() {
    this.setState({
      openModal: true
    })
  }

  close() {
    this.setState({
      openModal: false
    })
  }

  setSearchValue(e) {
    this.setState({
      searchValue: e
    })
  }

  stopInter() {
    clearInterval(flashTimer)
  }


  componentWillMount() {

    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/list'
    }).then(res => {
      if (res.statusCode === 200) {
        // 分配进去不同的数组
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].lottery === true) {
            this.state.lotteryActivity.push(res.data[i]);
            this.setState({
              lotteryActivity: this.state.lotteryActivity
            })
          } else {
            this.state.noneLotteryActivity.push(res.data[i]);
            this.setState({
              noneLotteryActivity: this.state.noneLotteryActivity
            })
          }
        }
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
          username: '您还未登录噢~',
          reward: '登录后就能看到中奖公告了呢~'
        }
      });
      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.length; i++) {
          this.state.userList.push(res.data[i].id);
          this.setState({
            userList: this.state.userList,
            luckyDog: {
              username: '恭喜121',
              reward: '获得JAVA高编教程'
            }
          })
        }
        flashTimer = setInterval(() => {
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
                      username: '恭喜' + luckU.data[0].username,
                      reward: '获得' + luck.data[priceIndex].reward.name
                    }
                  })
                }
              })
            }
          });
        }, 3000)
      }
    })
  }


  toAcDetail(mid) {
    Taro.navigateTo({
      url: '/pages/Activity/activityDetail?id=' + mid
    })
  }

  config = {
    navigationBarTitleText: '首页',
  };

  reFlash() {

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
        <AtSearchBar value={this.state.searchValue} onChange={this.setSearchValue.bind(this)}/>
        <AtModal content='这些按键的功能还在开发中噢，现在只是个装饰还不能用的呢' isOpened={this.state.openModal} confirmText='好吧'
                 onConfirm={this.close.bind(this)} onClose={this.close.bind(this)}/>
        <AtNoticebar single close onClose={this.stopInter.bind(this)}
                     icon='volume-plus'>{this.state.luckyDog.username}{this.state.luckyDog.reward}</AtNoticebar>
        <View style='text-align: center;'>
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            vertical={false}
            indicatorDots={false}
            circular
            skipHiddenItemLayout
            autoplay>
            <SwiperItem>
              <View><Image style='width:100%;height:100%' mode={"widthFix"} src='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/image/1.jpeg'/></View>
            </SwiperItem>
            <SwiperItem>
              <View><Image style='width:100%;height:100%' mode={"widthFix"} src='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/image/2.jpeg'/></View>
            </SwiperItem>
          </Swiper>
        </View>
        <View style='margin-top: 2%'>
          <AtGrid onClick={this.click.bind(this)} mode='rect' data={
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
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.switchTabs.bind(this)}>
          <AtTabsPane current={this.state.current} index={0}>
            {
              this.state.noneLotteryActivity.map((item, index) => {
                return <View className='margin' key={index}>
                  <AtCard onClick={this.toAcDetail.bind(this, item.id)} title={item.name}
                          extra={'发起人：' + item.author.username}>
                    <View className='at-article__p' style='text-align: center;'>
                      <View style='color: gray'>当前参与人数:{item.p_number}</View>
                    </View>
                    <View>
                      {item.description}
                    </View>
                  </AtCard>
                </View>
              })
            }
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {
              this.state.lotteryActivity.map((item, index) => {
                return <View className='margin' key={index}>
                  <AtCard onClick={this.toAcDetail.bind(this, item.id)} title={item.name}
                          extra={'发起人：' + item.author.username}>
                    <View className='at-article__p' style='text-align: center;'>
                      <View style='color: gray'>当前参与人数:{item.p_number}</View>
                    </View>
                    <View>
                      {item.description}
                    </View>
                  </AtCard>
                </View>
              })
            }
          </AtTabsPane>
        </AtTabs>
        <AtDivider content='没有更多了'/>
      </View>
    )
  }
}
