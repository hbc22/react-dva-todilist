/**
 * Created by guangqiang on 2017/12/17.
 */
import queryString from 'query-string';
import * as todoService from '../services/todo'

export default {
  namespace: 'todo',
  state: {
    list: []
  },
  reducers: {
    save(state, { payload: { list } }) {
      return { ...state, list }
    }
  },
  effects: {
    *addTodo({ payload: value }, { call, put, select }) {
      console.log('cs', value)
      // 模拟网络请求
      // const data = yield call(todoService.query, value) //fuck,没有用
      // console.log(data)
      let tempList = yield select(state => state.todo.list)
      console.log('tempList', tempList)
      let list = []
      list = list.concat(tempList)
      console.log('lislll11', list)
      const tempObj = {}
      tempObj.title = value
      tempObj.id = list.length
      tempObj.finished = false
      list.push(tempObj)
      console.log('lislll', list)
      yield put({ type: 'save', payload: { list }})
    },
    *toggle({ payload: index }, { call, put, select }) {
      console.log('cs', index)
      // 模拟网络请求
      const data = yield call(todoService.query, index)
      // 不知道为什么在这里不能打印state，下面的{}里面也会报错的
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      console.log('hahlist', list)
      let obj = list[index]
      obj.finished = !obj.finished
      yield put({ type: 'save', payload: { list } })
    },
    *delete({ payload: index }, { call, put, select }) {
      // const data = yield call(todoService.query, index)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      list.splice(index, 1)
      yield put({ type: 'save', payload: { list } })
    },
    *modify({ payload: { value, index } }, { call, put, select }) {
      console.log('cs', index)
      console.log('cs', value)
      const data = yield call(todoService.query, value)
      let tempList = yield select(state => state.todo.list)
      let list = []
      list = list.concat(tempList)
      let obj = list[index]
      obj.title = value
      yield put({ type: 'save', payload: { list } })
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由的变化，请求页面数据
      return history.listen(({ pathname, search }) => {
        const query = queryString.parse(search)
        let list = []
        if (pathname === 'todoList') {
          dispatch({ type: 'save', payload: {list} })
        }
      })
    }
  }
}
