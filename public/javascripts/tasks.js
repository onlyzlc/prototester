var vm = new Vue({
    el:"#app",
    data: {
        tasks:[]
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
        selectPtt: function(){
            
        }
    }
})
axios.get('tasks/myTasks')
    .then(function(response){
        console.log(response.data);
        vm.tasks = response.data;
    });

