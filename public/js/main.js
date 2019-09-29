var homeVm = new Vue({
	el: "#app",
	created: 

	function () {
    setTimeout(()=>{this.show = true}, 800)

    setTimeout(()=>{this.show2 = true}, 1100)

    setTimeout(()=>{this.show3 = true}, 1400)
  },
	data: {
		show: false,
		show2: false,
		show3: false,

	},

})

