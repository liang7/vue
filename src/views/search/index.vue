<template>
  <section>
    <div class="s-box">
      <div class="s-s">
        <form @submit="confirmSubmit($event)" class="s-form">
          <input type="search" name="keyWords" placeholder="搜索" v-model="keyWords" :focus="true" />
          <span class="icon" @click="clear"></span>
        </form>
      </div>
      <router-link class="s-c" to="/">取消</router-link>
    </div>
    <div class="results">
      <router-link class="item" v-for="item in subjects" :key="item.id" :to="'/detail/'+item.id">
        <img class="pic" :src="item.pic" mode="aspectFill">
        <div class="text">
          <p class="title">{{item.title}}</p>
          <p class="ave">评分{{item.ave}}</p>
        </div>
      </router-link>
      <div style="text-align: center;padding-bottom:15px">
        <button @click="moreResult" class="more loading">{{moreText}}</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  metaInfo: {
    title: '凉凉影视-搜索', 
    meta: [{
      name: '搜索',
      content: '搜索'
    }]
  },
  data() {
    return {
      page: 0,
      keyWords: "",
      moreText: '',
      subjects: []
    };
  },
  activated() {
    // useCache为false时才重新刷新获取数据
    // 因为对list使用keep-alive来缓存组件，所以默认是会使用缓存数据的         
    if (!this.$route.meta.useCache) {
      this.clear() // 清空原有数据
    }
    this.$route.meta.useCache = false
  },
  // 列表页面的beforeRouteLeave钩子函数
  beforeRouteLeave(to, from, next) {
    if (to.name == 'detail') {
      from.meta.useCache = true
    }
    next();
  },
  methods: {
    //搜索
    confirmSubmit(e) {
      this.page = 0
      this.searchData()
      e.stopPropagation()
      e.preventDefault()
    },
    searchData() {
      let url = `/j/search/?q=${decodeURIComponent(
        this.keyWords
      )}&t=movie&p=${this.page}`
      this.moreText = '加载中...'
      this.$http.get(url).then(res => {
        if (res.count) {
          this.handleHtml(res.html)
          this.moreText = (res.count > res.limit && res.html) ? '更多结果' : ''
        } else {
          this.moreText = '暂无搜索结果'
        }
      })
    },
    //查看更多
    moreResult() {
      this.page += 1
      this.moreText = ''
      this.searchData()
    },
    //处理html字符串
    handleHtml(html) {
      let arr = []
      html = html.split('</li>')
      html.forEach((item) => {
        if (item) {
          let obj = {
            id: this.getId(item),
            pic: this.getPic(item),
            title: this.getTitle(item),
            ave: this.getAve(item)
          }
          arr.push(obj)
        }
      })
      if (this.page === 0) {
        this.subjects = Object.freeze(arr)
      } else {
        this.subjects = [...this.subjects, ...arr]
      }
    },
    //获取ID
    getId(str) {
      str = str.split('/subject/')[1]
      let end = str ? str.indexOf('/">') : 0
      return str.substr(0, end)
    },
    //获取图片
    getPic(str) {
      str = str.split('src="')[1]
      let end = str ? str.indexOf('"/') : 0
      return str.substr(0, end)
    },
    //获取标题
    getTitle(str) {
      str = str.split('subject-title">')[1]
      let end = str ? str.indexOf('</') : 0
      return str.substr(0, end)
    },
    //获取评分
    getAve(str) {
      str = str.split('data-rating="')[1]
      let end = str ? str.indexOf('">') : 0
      return str ? str.substr(0, end) * 1 / 10 : '暂无评分'
    },
    // 清楚搜索条件
    clear() {
      this.keyWords = ""
      this.moreText = ''
      this.subjects = []
    }
  }
}
</script>
<style scoped>
.container {
  padding: 0 0 .3rem 0;
  height: 100%;
}
.s-box {
  display: flex;
  padding: .3rem 0 .3rem .3rem;
}
.s-form {
  width: 100%;
  display: flex;
}
.s-s {
  display: flex;
  flex: 1;
  border: 1px solid #e6e5ea;
  background: #fff;
  border-radius: .08rem;
  overflow: hidden;
}
.s-s input {
  flex: 1;
  height: .72rem;
  line-height: .72rem;
  padding: .16rem .2rem;
  border: 0;
  outline: 0;
  line-height: 14px;
}
.icon {
  position: relative;
  width: .28rem;
  height: .28rem;
  border-radius: 50%;
  background: #999;
  margin: .22rem .2rem;
}
.icon:before,
.icon:after {
  content: "";
  position: absolute;
  width: .16rem;
  height: .02rem;
  left: .06rem;
  top: .12rem;
  background: #fff;
}
.icon:before {
  transform: rotate(45deg);
}
.icon:after {
  transform: rotate(-45deg);
}
.s-c {
  padding: 0 .3rem;
  height: .72rem;
  line-height: .72rem;
  color: #42bd56;
}

.item {
  display: flex;
  padding: .3rem;
  color: #333;
}
.pic {
  width: .8rem;
  height: 1.16rem;
}
.title {
  margin-bottom: .1rem;
  font-size: .3rem;
}
.ave {
  color: #aaa;
}
.text {
  flex: 1;
  padding-left: .2rem;
}
.more {
  font-size: .28rem;
  color: #42bd56;
}
</style>
 