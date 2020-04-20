// 对话框组件
Vue.component("dlg",{
    props: ["dialog"],
    data: function(){
        return{
            // visibility: this.dialog.visibility=false
        }
    },
    template:`
        <div class="dialog_container" v-show="dialog.visibility">
            <div class="dialog_panel">
                <h3>{{dialog.title}}</h3>
                <div class="dialog_content">
                    <slot></slot>
                </div>
                <div class="dialog_foot">
                    <button @click="dialog.visibility=false">确定</button>
                    <button @click="dialog.visibility=false">取消</button>
                </div>
            </div>
        </div>
    `,
    methods:{
        show: function(){
            this.visibility=true;
        },
        hide: function(){
            this.visibility=false;
        }
    }
})


var vm = new Vue({
    el:"#app",
    data: {
        tasks:[],
        dialog_selectPtt: false,
        protos:[],
        selectedPtt:"",
        
        dlg_a:{
            title: '选择原型',
            visibility: false
        },
        dlg_b:{
            title: '选择上传方式',
            visibility: false
        }
        
    },
    methods: {
        publish: function(index){
            let thisTask = this.tasks[index];
            let newStatus = (thisTask.status === "published")? "unpublished":"published";
            axios.patch("/tasks/"+thisTask.taskId+"/status",{status:newStatus})
                .then(()=> thisTask.status = newStatus)
                .catch(function (error) {
                    // handle error
                    console.log(error);
                  })
        },


    }
})
axios.get('tasks/myTasks')
    .then(function(response){
        console.log("获取到任务：%o",response.data);
        vm.tasks = response.data;
    });

axios.get('user/myProtos')
    .then(function(response){
        console.log("获取到原型：%o",response.data);
        vm.protos = response.data;
    });


