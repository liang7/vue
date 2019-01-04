<template>
  <section>
    <section class="hd">
      <div class="tags">
        <label v-for="(item, index) in tags" :key="index" v-on:click="getSubjectsBytag(item)" :class="{ active: tag === item }">{{item}}</label>
      </div>
      <router-link to="/search" class="a-icon">搜索</router-link>
    </section>
    <section class="radio-group" @change="radioChange">
      <label class="radio" v-for="item in sorts" :key="item.value">
        <input type="radio" :value="item.value" :checked="item.value == sort"/>{{item.name}}
      </label>
    </section>
    <section class="subjects">
      <router-link class="subjects-item" v-for="item in subjects" :key="item.id" :to="'/detail/'+item.id">
        <div class="pic" :style="'background:url('+item.cover+') no-repeat;background-size: cover'"></div>
        <p class="p1">{{item.title}}</p>
        <p class="p2">{{item.rate}}</p>
      </router-link>
      <div style="width:100%;text-align: center;padding:15px">
        <button @click="moreSubjects" class="more loading">{{moreText}}</button>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tags: Object.freeze([
        "热门",
        "美剧",
        "英剧",
        "韩剧",
        "日剧",
        "国产剧",
        "港剧",
        "日本动画",
        "综艺",
        "纪录片"
      ]),
      sorts: Object.freeze([{
        value: 'recommend',
        name: '按热度排序'
      },{
        value: 'time',
        name: '按时间排序'
      },{
        value: 'rank',
        name: '按评价排序'
      }]),
      sort: "recommend",
      tag: "热门",
      moreText: "加载中...",
      page_start: 0,
      page_limit: 21,
      subjects: []
    }
  },
  async mounted() {
    await this.getSubjects()
    console.log(webpackJsonp)
    setTimeout(() => {
      import(/* webpackPrefetch: true, webpackChunkName: "detail"*/ "@/views/detail/index.vue")
      import(/* webpackPrefetch: true, webpackChunkName: "search"*/ "@/views/search/index.vue")
    }, 17);
  },
  methods: {
    //获取 subjects
    async getSubjects() {
      let url = `/douban/j/search_subjects?type=tv&tag=${decodeURIComponent(
        this.tag
      )}&sort=${this.sort}&page_limit=${this.page_limit}&page_start=${
        this.page_start
      }`
      let res = await this.$http.get(url)
      let subjects = res.subjects || []
      if (this.page_start === 0) {
        this.subjects = Object.freeze(subjects)
      } else {
        this.subjects = Object.freeze([...this.subjects, ...subjects])
      }
      this.moreText = subjects.length?'查看更多':''
    },
    //查看更多
    moreSubjects() {
      this.page_start += this.page_limit
      this.moreText = '加载中...'
      this.getSubjects()
    },
    reset() {
      this.subjects = []
      this.page_start = 0
      this.moreText = '加载中...'
      this.getSubjects()
    },
    //
    getSubjectsBytag(tag) {
      this.tag = tag
      this.reset()
    },
    radioChange(e) {
      this.sort = e.target.value
      this.reset()
    }
  }
}
</script>

<style scoped>
.hd {
  display: flex;
}
.a-icon {
  margin-top: .04rem;
  height: .52rem;
  color: #42bd56;
}
.tags {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  font-size: 14px;
  padding-bottom: .2rem;
}
.tags label {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: .04rem .1rem;
  margin: 0 11px 8px 0;
  border-radius: .06rem;
}
.tags label.active {
  background: #4b8ccb;
  color: #fff;
}
.radio-group {
  padding-bottom: .4rem;
}
.subjects {
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
}

.subjects-item {
  width: 31%;
  display: inline-block;
  text-align: center;
  margin-bottom: .3rem;
  margin-right: 3.5%;
  color: #333;
}
.subjects-item:nth-child(3n+3) {
  margin-right: 0;
}
.subjects-item .pic {
  width: 100%;
  height: 3rem;
  max-height: 320px;
}
.subjects-item p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.p1 {
  padding: .1rem 0 .06rem;
  /* color: #37a; */
}
.p2 {
  color: #e09015;
}
.more {
  font-size: 14px;
  color: #42bd56;
}
</style>
 