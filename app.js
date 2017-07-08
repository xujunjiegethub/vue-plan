//存取localstrong中的数据

var store = {
	save:function(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch:function(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

var list = store.fetch('plan');

var filter = {
				all:function(list){
					return list;
				},
				finished:function(list){
					return list.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function(){
					return list.filter(function(item){
						return !item.isChecked;
				})
			}
		}


//数据
// var list = [
// // 			{title:'吃饭'},
// // 			{title:'睡觉'},
// // 			{title:'打豆豆'}
// ];
//实例化
var vm = new Vue({
	el:'.main',
	data:{
		list:list,
		todo:'',
		edtorTodos:'',
		beforetitle:'',           //记录正在编辑数据的title
		visibility:'all'
	},
	watch:{
		// list:function(){        //监控list这个属性
		// 	store.save('plan',this.list)
		// }
		list:{
			handler:function(){
				store.save('plan',this.list);
			},
			deep:true
		}
	},
	computed:{
		noCheckeLength:function(){
			return this.list.filter(function(item){
                   return  !item.isChecked
            }).length 
		},
		filteredList:function(){
			
		return filter[this.visibility] ? filter[this.visibility](list) : list;
	}
	},
	methods:{
		addTodo:function(){		     //添加任务
			//向list中添加任务
			this.list.push({ title:this.todo,isChecked:false });
			//输入完成数据
			this.todo = ''
		},
		deleteTodo:function(msg){     //删除任务
			
			var index = this.list.indexOf(msg);
			this.list.splice(index,1)
		},
		edtorTodo:function(msg){      //编辑任务
			this.edtorTodos = msg;

			this.beforetitle = msg.title;
		},
		edtorTodoed:function(msg){
			this.edtorTodos = ''
		},
		cancelTodo:function(msg){		//取消编辑任务
			msg.title = this.beforetitle;

			//让div显示,input隐藏
			this.edtorTodos = '';
		}

	},
	//自定义指令
	directives:{
		'foucs':{
				update(el,binding){
					if(binding.value){
						el.focus();
					}
				}
		}
	}
});


function watchhashchange(){
	var hash = window.location.hash.slice(1);
	
	vm.visibility = hash;
}

watchhashchange();

window.addEventListener('hashchange',watchhashchange);